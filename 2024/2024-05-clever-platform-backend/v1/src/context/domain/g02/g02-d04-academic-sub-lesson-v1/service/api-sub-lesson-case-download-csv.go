package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
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

type SubLessonCaseDownloadCsvRequest struct {
	LessonId  int       `params:"lessonId" validate:"required"`
	StartDate time.Time `query:"start_date"`
	EndDate   time.Time `query:"end_date"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubLessonCaseDownloadCsvRequest{}, helper.ParseOptions{Params: true, Query: true})
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

	subLessonCaseDownloadCsvOutput, err := api.Service.SubLessonCaseDownloadCsv(&SubLessonCaseDownloadCsvInput{
		SubjectId:                       subjectId,
		Roles:                           roles,
		SubLessonCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=sub-lessons.csv")
	return context.Status(http.StatusOK).Send(subLessonCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type SubLessonCaseDownloadCsvInput struct {
	SubjectId string
	Roles     []int
	*SubLessonCaseDownloadCsvRequest
}

type SubLessonCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) SubLessonCaseDownloadCsv(in *SubLessonCaseDownloadCsvInput) (*SubLessonCaseDownloadCsvOutput, error) {
	curriculumGroupId, err := service.academicSubLessonStorage.LessonCaseGetCurriculumGroupId(in.LessonId)
	if err != nil {
		return nil, err
	}

	contentCreators, err := service.academicSubLessonStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
	if err != nil {
		return nil, err
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
			return nil, helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	subLessons, err := service.academicSubLessonStorage.ListSubjectSubLesson(
		nil,
		in.LessonId,
		constant.SubLessonListFilter{
			StartDate: in.StartDate,
			EndDate:   in.EndDate,
		})
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.SubLessonCsvHeader}
	if subLessons != nil {
		for i, subLesson := range *subLessons {
			indicator, err := service.academicSubLessonStorage.SubLessonCaseGetIndicator(subLesson.Id)
			if err != nil {
				return nil, err
			}
			var subLessonIndex int
			var subLessonName, status string
			if subLesson.Index != nil {
				subLessonIndex = *subLesson.Index
			}
			if subLesson.Name != nil {
				subLessonName = *subLesson.Name
			}
			if subLesson.Status != nil {
				status = *subLesson.Status
			}
			csvData = append(csvData, []string{
				strconv.Itoa(i + 1),
				strconv.Itoa(subLesson.Id),
				strconv.Itoa(subLessonIndex),
				subLessonName,
				*indicator,
				status,
			})
		}
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SubLessonCaseDownloadCsvOutput{FileContent: bytes}, nil
}
