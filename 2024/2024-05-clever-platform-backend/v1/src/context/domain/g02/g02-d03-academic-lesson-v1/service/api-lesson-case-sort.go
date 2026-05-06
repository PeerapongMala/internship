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

type LessonCaseSortRequest struct {
	Lessons map[int]int `json:"lessons" validate:"required"`
}

// ==================== Response ==========================

type LessonCaseSortResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseSort(context *fiber.Ctx) error {
	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	request, err := helper.ParseAndValidateRequest(context, &LessonCaseSortRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

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

	err = api.Service.LessonCaseSort(&LessonCaseSortInput{
		Roles:     roles,
		UserId:    userId,
		SubjectId: subjectId,
		Lessons:   request.Lessons,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonCaseSortResponse{
		StatusCode: http.StatusOK,
		Message:    "Lessons sorted",
	})
}

// ==================== Service ==========================

type LessonCaseSortInput struct {
	Roles     []int
	UserId    string
	SubjectId int
	Lessons   map[int]int
}

func (service *serviceStruct) LessonCaseSort(in *LessonCaseSortInput) error {
	for lessonId, _ := range in.Lessons {
		curriculumGroupId, err := service.academicLessonStorage.LessonCaseGetCurriculumGroupId(lessonId)
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
	}

	tx, err := service.academicLessonStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.academicLessonStorage.LessonCaseSort(tx, in.Lessons, in.SubjectId)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
