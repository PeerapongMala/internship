package service

import (
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubjectSubLessonUpdateResponse struct {
	StatusCode int                               `json:"status_code"`
	Data       constant.SubjectSubLessonResponse `json:"data"`
	Message    string                            `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectSubLessonUpdate(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subLessonId, err := context.ParamsInt("subLessonId")
	request, err := helper.ParseAndValidateRequest(context, &constant.SubjectSubLessonRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.Id = subLessonId
	request.UpdatedAt = time.Now()
	request.UpdatedBy = subjectId
	response, err := api.Service.SubjectSubLessonUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(SubjectSubLessonUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       *response,
		Message:    "Subject sub lesson Update",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) SubjectSubLessonUpdate(request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error) {
	list, err := service.academicSubLessonStorage.UpdateSubjectSubLesson(request)
	if err != nil {
		return nil, err
	}

	return list, nil
}
