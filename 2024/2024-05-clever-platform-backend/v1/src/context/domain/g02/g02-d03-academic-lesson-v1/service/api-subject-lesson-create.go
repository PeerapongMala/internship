package service

import (
	"github.com/pkg/errors"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubjectLessonCreateResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       constant.SubjectLessonResponse `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectLessonCreate(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &constant.SubjectLessonCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.CreatedAt = time.Now()
	request.CreatedBy = subjectId
	// log.Println("request", request)
	response, err := api.Service.SubjectLessonCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(SubjectLessonCreateResponse{
		StatusCode: http.StatusOK,
		Data:       *response,
		Message:    "Subject lesson create",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) SubjectLessonCreate(request *constant.SubjectLessonCreateRequest) (*constant.SubjectLessonResponse, error) {
	tx, err := service.academicLessonStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	list, err := service.academicLessonStorage.CreateSubjectLesson(tx, request)
	if err != nil {
		return nil, err
	}

	isExtra := false
	if strings.Contains(strings.ToLower(request.Name), `extra`) {
		isExtra = true
	}

	err = service.academicLessonStorage.LessonPrefill(tx, request.SubjectId, list.Id, isExtra)
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
