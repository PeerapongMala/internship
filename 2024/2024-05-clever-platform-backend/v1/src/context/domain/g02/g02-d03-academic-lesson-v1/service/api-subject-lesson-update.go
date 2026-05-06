package service

import (
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubjectLessonUpdateResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       constant.SubjectLessonResponse `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectLessonUpdate(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &constant.SubjectLessonPatchRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.UpdatedAt = time.Now()
	request.UpdatedBy = subjectId
	response, err := api.Service.SubjectLessonUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(SubjectLessonUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       *response,
		Message:    "Subject lesson Update",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) SubjectLessonUpdate(request *constant.SubjectLessonPatchRequest) (*constant.SubjectLessonResponse, error) {
	list, err := service.academicLessonStorage.UpdateSubjectLesson(request)
	if err != nil {
		return nil, err
	}

	return list, nil
}
