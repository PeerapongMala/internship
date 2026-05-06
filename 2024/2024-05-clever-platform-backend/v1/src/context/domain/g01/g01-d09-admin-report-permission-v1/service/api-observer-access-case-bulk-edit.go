package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type ObserverAccessCaseBulkEditRequest struct {
	BulkEditList []constant.ObserverAccessBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
}

// ==================== Response ==========================

type ObserverAccessCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverAccessCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverAccessCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ObserverAccessCaseBulkEdit(&ObserverAccessCaseBulkEditInput{
		SubjectId:                         subjectId,
		ObserverAccessCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&ObserverAccessCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type ObserverAccessCaseBulkEditInput struct {
	SubjectId string
	*ObserverAccessCaseBulkEditRequest
}

func (service *serviceStruct) ObserverAccessCaseBulkEdit(in *ObserverAccessCaseBulkEditInput) error {
	tx, err := service.adminReportPermissionStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		observerAccess, err := service.adminReportPermissionStorage.ObserverAccessGet(&bulkEditItem.ObserverAccessId)
		if err != nil {
			return err
		}

		now := time.Now().UTC()
		observerAccess.UpdatedAt = &now
		observerAccess.UpdatedBy = &in.SubjectId
		observerAccess.Status = &bulkEditItem.Status
		_, err = service.adminReportPermissionStorage.ObserverAccessUpdate(tx, observerAccess)
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
