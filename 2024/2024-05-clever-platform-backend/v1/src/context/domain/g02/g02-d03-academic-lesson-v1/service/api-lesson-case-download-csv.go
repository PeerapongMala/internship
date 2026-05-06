package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"slices"
	"strconv"
	"time"
)

// ==================== Request ==========================

type LessonCaseDownloadCsvRequest struct {
	SubjectId int       `params:"subjectId" validate:"required"`
	StartDate time.Time `query:"start_date"`
	EndDate   time.Time `query:"end_date"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonCaseDownloadCsvRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

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

	lessonCaseDownloadCsvOutput, err := api.Service.LessonCaseDownloadCsv(&LessonCaseDownloadCsvInput{
		LessonCaseDownloadCsvRequest: request,
		UserId:                       subjectId,
		Roles:                        roles,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=lessons.csv")
	return context.Status(http.StatusOK).Send(lessonCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type LessonCaseDownloadCsvInput struct {
	UserId string
	Roles  []int
	*LessonCaseDownloadCsvRequest
}

type LessonCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) LessonCaseDownloadCsv(in *LessonCaseDownloadCsvInput) (*LessonCaseDownloadCsvOutput, error) {
	curriculumGroupId, err := service.academicLessonStorage.SubjectCaseGetCurriculumGroupId(in.SubjectId)
	if err != nil {
		return nil, err
	}

	contentCreators, err := service.academicLessonStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
	if err != nil {
		return nil, err
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
			return nil, helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	lessons, err := service.academicLessonStorage.ListSubjectLesson(nil, in.SubjectId, constant.LessonListFilter{
		StartDate: in.StartDate,
		EndDate:   in.EndDate,
	})
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.LessonCsvHeader}
	if lessons != nil {
		for i, lesson := range *lessons {
			var lessonIndex int
			var lessonName string
			var status string
			if lesson.Index != nil {
				lessonIndex = *lesson.Index
			}
			if lesson.Name != nil {
				lessonName = *lesson.Name
			}
			if lesson.Status != nil {
				status = *lesson.Status
			}

			csvData = append(csvData, []string{
				strconv.Itoa(i + 1),
				strconv.Itoa(lesson.Id),
				strconv.Itoa(lessonIndex),
				lessonName,
				status,
			})
		}
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &LessonCaseDownloadCsvOutput{FileContent: bytes}, nil
}
