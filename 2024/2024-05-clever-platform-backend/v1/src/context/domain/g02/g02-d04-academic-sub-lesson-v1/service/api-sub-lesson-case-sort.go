package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SubLessonCaseSortRequest struct {
	SubLessons map[int]int `json:"sub_lessons" validate:"required"`
}

// ==================== Response ==========================

type SubLessonCaseSortResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonCaseSort(context *fiber.Ctx) error {
	lessonId, err := context.ParamsInt("lessonId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	request, err := helper.ParseAndValidateRequest(context, &SubLessonCaseSortRequest{})
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

	err = api.Service.SubLessonCaseSort(&SubLessonCaseSortInput{
		Roles:      roles,
		SubjectId:  subjectId,
		LessonId:   lessonId,
		SubLessons: request.SubLessons,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonCaseSortResponse{
		StatusCode: http.StatusOK,
		Message:    "Sub-lessons sorted",
	})
}

// ==================== Service ==========================

type SubLessonCaseSortInput struct {
	Roles      []int
	SubjectId  string
	LessonId   int
	SubLessons map[int]int
}

func (service *serviceStruct) SubLessonCaseSort(in *SubLessonCaseSortInput) error {
	for subLessonId, _ := range in.SubLessons {
		curriculumGroupId, err := service.academicSubLessonStorage.SubLessonCaseGetCurriculumGroupId(subLessonId)
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
	}

	tx, err := service.academicSubLessonStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.academicSubLessonStorage.SubLessonCaseSort(tx, in.SubLessons, in.LessonId)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
