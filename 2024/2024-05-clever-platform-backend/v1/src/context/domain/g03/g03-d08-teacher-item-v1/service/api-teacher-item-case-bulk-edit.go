package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type TeacherItemCaseBulkEditRequest struct {
	BulkEditList []constant.TeacherItemBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
	AdminLoginAs *string                            `json:"admin_login_as"`
}

// ==================== Response ==========================

type TeacherItemCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherItemCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ItemCaseBulkEdit(&TeacherItemCaseBulkEditInput{
		TeacherItemCaseBulkEditRequest: request,
		SubjectId:                      subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherItemCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type TeacherItemCaseBulkEditInput struct {
	*TeacherItemCaseBulkEditRequest
	SubjectId string
}

func (service *serviceStruct) ItemCaseBulkEdit(in *TeacherItemCaseBulkEditInput) error {
	tx, err := service.teacherItemStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	now := time.Now().UTC()
	for _, bulkEditItem := range in.BulkEditList {
		err := service.teacherItemStorage.ItemUpdate(tx, &constant.ItemEntity{
			Id:           bulkEditItem.Id,
			Status:       bulkEditItem.Status,
			UpdatedAt:    &now,
			UpdatedBy:    &in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		})
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
