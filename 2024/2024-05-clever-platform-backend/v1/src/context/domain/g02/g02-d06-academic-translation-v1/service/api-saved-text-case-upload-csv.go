package service

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"strconv"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SavedTextCaseUploadCsvRequest struct {
	CsvFile      *multipart.FileHeader `form:"csv_file"`
	AdminLoginAs *string               `form:"admin_login_as"`
}

// ==================== Response ==========================

type SavedTextCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCaseUploadCsv(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &SavedTextCaseUploadCsvRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.CsvFile = csvFile

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SavedTextCaseUploadCsv(&SavedTextCaseUploadCsvInput{
		Roles:                         roles,
		SubjectId:                     subjectId,
		CurriculumGroupId:             curriculumGroupId,
		SavedTextCaseUploadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type SavedTextCaseUploadCsvInput struct {
	Roles             []int
	SubjectId         string
	CurriculumGroupId int
	*SavedTextCaseUploadCsvRequest
}

func (service *serviceStruct) SavedTextCaseUploadCsv(in *SavedTextCaseUploadCsvInput) error {
	contentCreators, err := service.academicTranslationStorage.CurriculumGroupCaseListContentCreator(in.CurriculumGroupId)
	if err != nil {
		return err
	}

	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		isValid := false
		for _, contentCreator := range contentCreators {
			if contentCreator.Id == in.SubjectId {
				isValid = true
				break
			}
		}
		if !isValid || len(contentCreators) == 0 {
			msg := "User isn't content creator of this curriculum group"
			return helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	file, err := in.CsvFile.Open()
	if err != nil {
		return err
	}
	defer file.Close()
	reader := csv.NewReader(file)
	_, err = reader.Read()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	tx, err := service.academicTranslationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	lineNumber := 2
	for {
		row, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if len(row) != len(constant.SavedTextCsvHeader) {
			msg := "Incorrect number of columns"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		savedTextEntity := constant.SavedTextEntity{}

		// id
		if row[0] != "" {
			id, err := strconv.Atoi(row[0])
			if err != nil {
				msg := fmt.Sprintf(`Invalid id at column %d of row %d`, 1, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			savedTextEntity.Id = id
		}

		// language
		if !slices.Contains(constant.LanguageList, row[1]) {
			msg := fmt.Sprintf("Invalid language at column %d of row %d", 2, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		savedTextEntity.Language = row[1]

		// text
		if row[2] == "" {
			msg := fmt.Sprintf("Invalid text at column %d of row %d", 3, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		savedTextEntity.Text = &row[2]

		// text to ai
		savedTextEntity.TextToAi = &row[3]

		// status
		if !slices.Contains(constant.SavedTextStatusList, row[4]) {
			msg := fmt.Sprintf(`Invalid status at column %d of row %d`, 5, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		savedTextEntity.Status = row[4]

		if savedTextEntity.Id == 0 {
			savedTextEntity.CurriculumGroupId = in.CurriculumGroupId
			savedTextEntity.CreatedAt = time.Now().UTC()
			savedTextEntity.CreatedBy = in.SubjectId
			savedTextEntity.AdminLoginAs = in.AdminLoginAs

			savedTextEntity.GroupId = uuid.NewString()
			if savedTextEntity.TextToAi != nil && *savedTextEntity.TextToAi == "" {
				savedTextEntity.TextToAi = savedTextEntity.Text
			}

			_, err := service.academicTranslationStorage.SavedTextCreate(tx, &savedTextEntity)
			if err != nil {
				return err
			}
		} else {
			now := time.Now().UTC()
			savedTextEntity.UpdatedAt = &now
			savedTextEntity.UpdatedBy = &in.SubjectId
			savedTextEntity.AdminLoginAs = in.AdminLoginAs

			savedTextUpdateEntity := constant.SavedTextUpdateEntity{}
			err := copier.Copy(&savedTextUpdateEntity, &savedTextEntity)
			if err != nil {
				return err
			}
			_, err = service.academicTranslationStorage.SavedTextUpdate(tx, &savedTextUpdateEntity)
			if err != nil {
				if err == sql.ErrNoRows {
					msg := fmt.Sprintf("Id %d in column %d of row %d not found", savedTextEntity.Id, 1, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				return err
			}
		}
		lineNumber++
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
