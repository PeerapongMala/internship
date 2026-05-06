package service

import (
	"encoding/csv"
	"fmt"
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"strconv"
	"time"
)

// ==================== Request ==========================

type SubLessonCaseUploadCsvRequest struct {
	LessonId     int                   `params:"lessonId"`
	CsvFile      *multipart.FileHeader `form:"csv_file"`
	AdminLoginAs *string               `form:"admin_login_as"`
}

// ==================== Response ==========================

type SubLessonCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonCaseUploadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubLessonCaseUploadCsvRequest{}, helper.ParseOptions{
		Body:   true,
		Params: true,
	})
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

	err = api.Service.SubLessonCaseUploadCsv(&SubLessonCaseUploadCsvInput{
		SubjectId:                     subjectId,
		Roles:                         roles,
		SubLessonCaseUploadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type SubLessonCaseUploadCsvInput struct {
	SubjectId string
	Roles     []int
	*SubLessonCaseUploadCsvRequest
}

func (service *serviceStruct) SubLessonCaseUploadCsv(in *SubLessonCaseUploadCsvInput) error {
	curriculumGroupId, err := service.academicSubLessonStorage.LessonCaseGetCurriculumGroupId(in.LessonId)
	if err != nil {
		return err
	}

	contentCreators, err := service.academicSubLessonStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
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

	tx, err := service.academicSubLessonStorage.BeginTx()
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
		if len(row) != len(constant.SubLessonCsvHeader) {
			msg := "Incorrect number of columns"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		subLessonEntity := constant.SubLessonEntity{
			LessonId:     in.LessonId,
			AdminLoginAs: in.AdminLoginAs,
		}

		// id
		if row[1] != "" {
			id, err := strconv.Atoi(row[1])
			if err != nil {
				msg := fmt.Sprintf(`Invalid id at columnn %d of row %d`, 2, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			subLessonEntity.Id = id
		}

		// บทย่อยที่
		if row[2] == "" {
			msg := fmt.Sprintf(`Invalid index at columnn %d of row %d`, 3, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		} else {
			index, err := strconv.Atoi(row[2])
			if err != nil {
				msg := fmt.Sprintf(`Invalid format at column %d of row %d`, 3, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			subLessonEntity.Index = index
		}

		// ชื่อบทเรียนย่อย
		if row[3] == "" {
			msg := fmt.Sprintf(`Invalid name at columnn %d of row %d`, 4, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		subLessonEntity.Name = &row[3]

		// ชื่อย่อตัวชี้วัด
		if row[4] == "" {
			msg := fmt.Sprintf(`Invalid indicator short name at columnn %d of row %d`, 5, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		} else {
			indicatorId, err := service.academicSubLessonStorage.IndicatorCaseGetByShortName(tx, row[4], *curriculumGroupId)
			if err != nil {
				msg := fmt.Sprintf(`Indicator doesn't exist'`)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			subLessonEntity.IndicatorId = *indicatorId
		}

		// สถานะ
		if row[5] == "" || !slices.Contains(constant.SubLessonStatusList, row[5]) {
			msg := fmt.Sprintf(`Invalid status at columnn %d of row %d`, 6, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		subLessonEntity.Status = row[5]

		if subLessonEntity.Id == 0 {
			isExists, err := service.academicSubLessonStorage.SubLessonCaseCheckDuplicateIndex(tx, in.LessonId, subLessonEntity.Index)
			if err != nil {
				return err
			}
			if *isExists {
				msg := fmt.Sprintf(`Sub-lesson with index %d already exist on this lesson`, subLessonEntity.Index)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}

			subLessonEntity.CreatedAt = time.Now().UTC()
			subLessonEntity.CreatedBy = in.SubjectId
			subLesson, err := service.academicSubLessonStorage.SubLessonCreate(tx, &subLessonEntity)
			if err != nil {
				return err
			}

			err = service.academicSubLessonStorage.SubLessonPrefill(tx, subLesson.LessonId, subLesson.Id)
			if err != nil {
				return err
			}

		} else {
			isExists, err := service.academicSubLessonStorage.SubLessonCaseCheckDuplicateIndex(tx, in.LessonId, subLessonEntity.Index)
			if err != nil {
				return err
			}

			currentSubLesson, err := service.academicSubLessonStorage.SubLessonGet(tx, subLessonEntity.Id)
			if err != nil {
				return err
			}

			if *isExists && currentSubLesson.Index != subLessonEntity.Index {
				msg := fmt.Sprintf(`Sub-lesson with index %d already exist on this lesson`, subLessonEntity.Index)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}

			now := time.Now().UTC()
			subLessonEntity.UpdatedAt = &now
			subLessonEntity.UpdatedBy = &in.SubjectId
			_, err = service.academicSubLessonStorage.SubLessonUpdate(tx, &subLessonEntity)
			if err != nil {
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

	return err
}
