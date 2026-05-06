package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubLessonGetResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       []constant.SubLessonDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

func (api *APIStruct) SubLessonGet(context *fiber.Ctx) error {
	subLessonId, err := context.ParamsInt("subLessonId")
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

	subLessonGetOutput, err := api.Service.SubLessonGet(&SubLessonGetInput{
		Roles:       roles,
		SubjectId:   subjectId,
		SubLessonId: subLessonId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubLessonDataEntity{*subLessonGetOutput.SubLessonDataEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubLessonGetInput struct {
	Roles       []int
	SubjectId   string
	SubLessonId int
}

type SubLessonGetOutput struct {
	*constant.SubLessonDataEntity
}

func (service *serviceStruct) SubLessonGet(in *SubLessonGetInput) (*SubLessonGetOutput, error) {
	curriculumGroupId, err := service.academicSubLessonStorage.SubLessonCaseGetCurriculumGroupId(in.SubLessonId)
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

	subLesson, err := service.academicSubLessonStorage.SubLessonGet(nil, in.SubLessonId)
	if err != nil {
		return nil, err
	}

	return &SubLessonGetOutput{
		subLesson,
	}, nil
}
