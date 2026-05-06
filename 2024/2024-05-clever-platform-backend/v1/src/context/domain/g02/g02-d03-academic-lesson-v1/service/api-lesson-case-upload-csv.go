package service

import (
	"encoding/csv"
	"fmt"
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"strconv"
	"strings"
	"time"
)

// ==================== Request ==========================

type LessonCaseUploadCsvRequest struct {
	SubjectId    int                   `params:"subjectId"`
	CsvFile      *multipart.FileHeader `form:"csv_file"`
	AdminLoginAs *string               `form:"admin_login_as"`
}

// ==================== Response ==========================

type LessonCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseUploadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonCaseUploadCsvRequest{}, helper.ParseOptions{
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

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.LessonCaseUploadCsv(&LessonCaseUploadCsvInput{
		UserId:                     userId,
		Roles:                      roles,
		LessonCaseUploadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type LessonCaseUploadCsvInput struct {
	UserId string
	Roles  []int
	*LessonCaseUploadCsvRequest
}

func (service *serviceStruct) LessonCaseUploadCsv(in *LessonCaseUploadCsvInput) error {
	curriculumGroupId, err := service.academicLessonStorage.SubjectCaseGetCurriculumGroupId(in.SubjectId)
	if err != nil {
		return err
	}

	contentCreators, err := service.academicLessonStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
	if err != nil {
		return err
	}

	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		isValid := false
		for _, contentCreator := range contentCreators {
			if contentCreator.Id == in.UserId {
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

	tx, err := service.academicLessonStorage.BeginTx()
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
		if len(row) != len(constant.LessonCsvHeader) {
			msg := "Incorrect number of columns"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		lessonEntity := constant.LessonEntity{
			SubjectId:    in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		}

		// id
		if row[1] != "" {
			id, err := strconv.Atoi(row[1])
			if err != nil {
				msg := fmt.Sprintf(`Invalid id at columnn %d of row %d`, 2, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			lessonEntity.Id = id
		}

		// index
		if row[2] == "" {
			msg := fmt.Sprintf(`Invalid index at column %d of row %d`, 3, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		} else {
			index, err := strconv.Atoi(row[2])
			if err != nil {
				msg := fmt.Sprintf(`Invalid format at column %d  of row %d`, 3, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			lessonEntity.Index = index
		}

		// name
		if row[3] == "" {
			msg := fmt.Sprintf(`Invalid name at columnn %d of row %d`, 4, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		lessonEntity.Name = row[3]

		// status
		if row[4] == "" || !slices.Contains(constant.LessonStatusList, row[4]) {
			msg := fmt.Sprintf(`Invalid status at columnn %d of row %d`, 5, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		lessonEntity.Status = row[4]

		if lessonEntity.Id == 0 {
			lessonEntity.WizardIndex = 1
			lessonEntity.BackgroundImagePath = constant.DefaultBackgroundImagePath
			lessonEntity.FontName = constant.DefaultLessonFontFamily
			lessonEntity.FontSize = constant.DefaultLessonFontSize
			isExists, err := service.academicLessonStorage.LessonCaseCheckDuplicateIndex(tx, in.SubjectId, lessonEntity.Index)
			if err != nil {
				return err
			}
			if *isExists {
				msg := fmt.Sprintf(`Lesson with index %d already exist on this subject`, lessonEntity.Index)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}

			lessonEntity.CreatedAt = time.Now().UTC()
			lessonEntity.CreatedBy = in.UserId
			lesson, err := service.academicLessonStorage.LessonCreate(tx, &lessonEntity)
			if err != nil {
				return err
			}

			isExtra := false
			if strings.Contains(strings.ToLower(lessonEntity.Name), `extra`) {
				isExtra = true
			}

			err = service.academicLessonStorage.LessonPrefill(tx, in.SubjectId, lesson.Id, isExtra)
			if err != nil {
				return err
			}
		} else {
			isExists, err := service.academicLessonStorage.LessonCaseCheckDuplicateIndex(tx, in.SubjectId, lessonEntity.Index)
			if err != nil {
				return err
			}

			currentSubLesson, err := service.academicLessonStorage.LessonGet(tx, lessonEntity.Id)
			if err != nil {
				return err
			}

			if *isExists && currentSubLesson.Index != lessonEntity.Index {
				msg := fmt.Sprintf(`Lesson with index %d already exist on this subject`, lessonEntity.Index)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}

			now := time.Now().UTC()
			lessonEntity.UpdatedAt = &now
			lessonEntity.UpdatedBy = &in.UserId
			_, err = service.academicLessonStorage.LessonUpdate(tx, &lessonEntity)
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
