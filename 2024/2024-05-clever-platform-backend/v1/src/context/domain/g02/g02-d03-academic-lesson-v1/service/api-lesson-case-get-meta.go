package service

import (
	"net/http"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type LessonCaseGetMetaRequest struct {
	LessonIds []int `json:"lesson_ids" validate:"required"`
}

// ==================== Response ==========================
type LessonCaseGetMetaResponse struct {
	constant.StatusResponse
	Data []constant2.LessonMetaEntity `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseGetMeta(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &LessonCaseGetMetaRequest{}, helper.ParseOptions{Body: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.LessonCaseGetMeta(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonCaseGetMetaResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: data,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) LessonCaseGetMeta(in *LessonCaseGetMetaRequest) ([]constant2.LessonMetaEntity, error) {
	subjects, err := service.academicLessonStorage.LessonCaseGetMeta(in.LessonIds)
	if err != nil {
		return nil, err
	}

	for i, subject := range subjects {
		meta, err := service.academicLessonStorage.SubjectCaseGetMeta(subject.SubjectId)
		if err != nil {
			return nil, err
		}

		lessons, err := service.academicLessonStorage.LessonCaseGetSubLesson(subject.SubjectId)
		if err != nil {
			return nil, err
		}
		meta.Lessons = lessons

		subjects[i].SubjectMetaEntity = meta
	}

	return subjects, nil
}
