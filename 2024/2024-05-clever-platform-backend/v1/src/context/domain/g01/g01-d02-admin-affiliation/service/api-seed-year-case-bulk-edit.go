package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type SeedYearCaseBulkEditRequest struct {
	BulkEditList []constant.SeedYearBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
}

// ==================== Response ==========================

type SeedYearCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SeedYearCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SeedYearCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SeedYearCaseBulkEdit(&SeedYearCaseBulkEditInput{
		SubjectId:                   subjectId,
		SeedYearCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedYearCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type SeedYearCaseBulkEditInput struct {
	SubjectId string
	*SeedYearCaseBulkEditRequest
}

func (service *serviceStruct) SeedYearCaseBulkEdit(in *SeedYearCaseBulkEditInput) error {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		now := time.Now().UTC()
		seedYearEntity := constant.SeedYearEntity{
			Id:        bulkEditItem.SeedYearId,
			Status:    bulkEditItem.Status,
			UpdatedAt: &now,
			UpdatedBy: &in.SubjectId,
		}
		_, err := service.schoolAffiliationStorage.SeedYearUpdate(tx, &seedYearEntity)
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
