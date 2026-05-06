package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SchoolAffiliationCaseBulkEditRequest struct {
	BulkEditList []constant.SchoolAffiliationBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
	AdminLoginAs *string                                  `json:"admin_login_as"`
}

// ==================== Response ==========================

type SchoolAffiliationCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SchoolAffiliationCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SchoolAffiliationCaseBulkEdit(&SchoolAffiliationCaseBulkEditInput{
		SubjectId:                            subjectId,
		SchoolAffiliationCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type SchoolAffiliationCaseBulkEditInput struct {
	SubjectId string
	*SchoolAffiliationCaseBulkEditRequest
}

func (service *serviceStruct) SchoolAffiliationCaseBulkEdit(in *SchoolAffiliationCaseBulkEditInput) error {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		now := time.Now().UTC()
		schoolAffiliationEntity := constant.SchoolAffiliationEntity{
			Id:        bulkEditItem.SchoolAffiliationId,
			Status:    bulkEditItem.Status,
			UpdatedAt: &now,
			UpdatedBy: &in.SubjectId,
		}
		_, err := service.schoolAffiliationStorage.SchoolAffiliationUpdate(tx, &schoolAffiliationEntity)
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
