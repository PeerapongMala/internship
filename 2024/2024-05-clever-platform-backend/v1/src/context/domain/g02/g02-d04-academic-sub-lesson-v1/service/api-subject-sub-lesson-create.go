package service

import (
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubjectSubLessonCreateResponse struct {
	StatusCode int                               `json:"status_code"`
	Data       constant.SubjectSubLessonResponse `json:"data"`
	Message    string                            `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectSubLessonCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.SubjectSubLessonRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.CreatedAt = time.Now()
	request.UpdatedAt = time.Now()
	response, err := api.Service.SubjectSubLessonCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(SubjectSubLessonCreateResponse{
		StatusCode: http.StatusOK,
		Data:       *response,
		Message:    "Subject sub lesson create",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) SubjectSubLessonCreate(request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error) {
	tx, err := service.academicSubLessonStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	list, err := service.academicSubLessonStorage.CreateSubjectSubLesson(tx, request)
	if err != nil {
		return nil, err
	}

	err = service.academicSubLessonStorage.SubLessonPrefill(tx, request.LessonId, list.Id)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return list, nil
}
