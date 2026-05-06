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

type StudentCaseListTeacherNoteResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.TeacherNoteEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseListTeacherNote(context *fiber.Ctx) error {
	userId := context.Params("userId")

	pagination := helper.PaginationNew(context)
	filter, err := helper.ParseAndValidateRequest(context, &constant.TeacherNoteFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if filter.StartDate != "" {
		_, err = time.Parse(time.RFC3339, filter.StartDate)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
	}
	if filter.EndDate != "" {
		_, err = time.Parse(time.RFC3339, filter.EndDate)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
	}

	studentCaseListTeacherNoteOutput, err := api.Service.StudentCaseListTeacherNote(&StudentCaseListTeacherNoteInput{
		Filter:     filter,
		Pagination: pagination,
		UserId:     userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseListTeacherNoteResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       studentCaseListTeacherNoteOutput.TeacherNotes,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseListTeacherNoteInput struct {
	Filter     *constant.TeacherNoteFilter
	Pagination *helper.Pagination
	UserId     string
}

type StudentCaseListTeacherNoteOutput struct {
	TeacherNotes []constant.TeacherNoteEntity
}

func (service *serviceStruct) StudentCaseListTeacherNote(in *StudentCaseListTeacherNoteInput) (*StudentCaseListTeacherNoteOutput, error) {
	teacherNotes, err := service.adminSchoolStorage.StudentCaseListTeacherNote(in.UserId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	for i, teacherNote := range teacherNotes {
		if teacherNote.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*teacherNote.ImageUrl)
			if err != nil {
				return nil, err
			}
			teacherNotes[i].ImageUrl = url
		}
	}

	return &StudentCaseListTeacherNoteOutput{
		TeacherNotes: teacherNotes,
	}, nil
}
