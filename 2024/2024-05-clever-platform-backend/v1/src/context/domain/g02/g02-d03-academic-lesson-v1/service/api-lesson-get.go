package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type LessonGetResponse struct {
	StatusCode int                         `json:"status_code"`
	Data       []constant.LessonDataEntity `json:"data"`
	Message    string                      `json:"message"`
}

func (api *APIStruct) LessonGet(context *fiber.Ctx) error {
	lessonId, err := context.ParamsInt("lessonId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
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

	lessonGetOutput, err := api.Service.LessonGet(&LessonGetInput{
		Roles:     roles,
		SubjectId: subjectId,
		LessonId:  lessonId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.LessonDataEntity{*lessonGetOutput.LessonDataEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LessonGetInput struct {
	Roles     []int
	SubjectId string
	LessonId  int
}

type LessonGetOutput struct {
	*constant.LessonDataEntity
}

func (service *serviceStruct) LessonGet(in *LessonGetInput) (*LessonGetOutput, error) {
	curriculumGroupId, err := service.academicLessonStorage.LessonCaseGetCurriculumGroupId(in.LessonId)
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

	lesson, err := service.academicLessonStorage.LessonGet(nil, in.LessonId)
	if err != nil {
		return nil, err
	}

	return &LessonGetOutput{
		lesson,
	}, nil
}
