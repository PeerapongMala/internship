package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentCaseListLessonPlayLogResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.LessonPlayLogEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseListLessonPlayLog(context *fiber.Ctx) error {
	userId := context.Params("userId")
	classId, err := context.ParamsInt("classId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	pagination := helper.PaginationNew(context)
	lessonPlayLogFilter, err := helper.ParseAndValidateRequest(context, &constant.LessonPlayLogFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if lessonPlayLogFilter.StartDate != "" {
		_, err = time.Parse(time.RFC3339, lessonPlayLogFilter.StartDate)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
	}
	if lessonPlayLogFilter.EndDate != "" {
		_, err = time.Parse(time.RFC3339, lessonPlayLogFilter.EndDate)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
	}

	studentCaseListLessonPlayLogOutput, err := api.Service.StudentCaseListLessonPlayLog(&StudentCaseListLessonPlayLogInput{
		Filter:     lessonPlayLogFilter,
		Pagination: pagination,
		UserId:     userId,
		ClassId:    classId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseListLessonPlayLogResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       studentCaseListLessonPlayLogOutput.LessonPlayLogs,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseListLessonPlayLogInput struct {
	Filter     *constant.LessonPlayLogFilter
	Pagination *helper.Pagination
	UserId     string
	ClassId    int
}

type StudentCaseListLessonPlayLogOutput struct {
	LessonPlayLogs []constant.LessonPlayLogEntity
}

func (service *serviceStruct) StudentCaseListLessonPlayLog(in *StudentCaseListLessonPlayLogInput) (*StudentCaseListLessonPlayLogOutput, error) {
	lessonPlayLogs, err := service.adminSchoolStorage.StudentCaseListLessonPlayLog(in.UserId, in.ClassId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &StudentCaseListLessonPlayLogOutput{
		LessonPlayLogs: lessonPlayLogs,
	}, nil
}
