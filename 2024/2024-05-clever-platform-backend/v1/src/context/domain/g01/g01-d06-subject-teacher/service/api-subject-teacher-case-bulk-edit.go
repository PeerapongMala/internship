package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SubjectTeacherCaseBulkEditRequest struct {
	SubjectId    int                                   `params:"subjectId" validate:"required"`
	BulkEditList []constant.SubjectTeacherBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
}

// ==================== Response ==========================

type SubjectTeacherCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectTeacherCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectTeacherCaseBulkEditRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.SubjectTeacherCaseBulkEdit(&SubjectTeacherCaseBulkEditInput{
		SubjectTeacherCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectTeacherCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type SubjectTeacherCaseBulkEditInput struct {
	*SubjectTeacherCaseBulkEditRequest
}

func (service *serviceStruct) SubjectTeacherCaseBulkEdit(in *SubjectTeacherCaseBulkEditInput) error {
	err := service.subjectTeacherStorage.SubjectTeacherDelete(in.SubjectId, in.BulkEditList)
	if err != nil {
		return err
	}

	return nil
}
