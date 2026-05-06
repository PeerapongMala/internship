package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubLessonCaseListByLessonResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       []constant.SubLessonDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonCaseListByLesson(context *fiber.Ctx) error {
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

	subLessonCaseListByLessonOutput, err := api.Service.SubLessonCaseListByLesson(&SubLessonCaseListByLessonInput{
		Roles:     roles,
		SubjectId: subjectId,
		LessonId:  lessonId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonCaseListByLessonResponse{
		StatusCode: http.StatusOK,
		Data:       subLessonCaseListByLessonOutput.SubLessons,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubLessonCaseListByLessonInput struct {
	Roles     []int
	SubjectId string
	LessonId  int
}

type SubLessonCaseListByLessonOutput struct {
	SubLessons []constant.SubLessonDataEntity
}

func (service *serviceStruct) SubLessonCaseListByLesson(in *SubLessonCaseListByLessonInput) (*SubLessonCaseListByLessonOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.LessonCaseGetCurriculumGroupId(in.LessonId)
	if err != nil {
		return nil, err
	}

	contentCreators, err := service.academicLevelStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
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

	subLessons, err := service.academicLevelStorage.SubLessonCaseListByLesson(in.LessonId)
	if err != nil {
		return nil, err
	}

	return &SubLessonCaseListByLessonOutput{
		SubLessons: subLessons,
	}, nil
}
