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

type CurriculumGroupCaseBulkEditRequest struct {
	BulkEditList []constant.CurriculumGroupBulkEditItem `json:"bulk_edit_list" validate:"required"`
	AdminLoginAs *string                                `json:"admin_login_as"`
}

// ==================== Response ==========================

type CurriculumGroupCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &CurriculumGroupCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.CurriculumGroupCaseBulkEdit(&CurriculumGroupCaseBulkEditInput{
		SubjectId:                          subjectId,
		CurriculumGroupCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CurriculumGroupCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type CurriculumGroupCaseBulkEditInput struct {
	SubjectId string
	*CurriculumGroupCaseBulkEditRequest
}

func (service *serviceStruct) CurriculumGroupCaseBulkEdit(in *CurriculumGroupCaseBulkEditInput) error {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		now := time.Now().UTC()
		curriculumGroupEntity := constant.CurriculumGroupEntity{
			Id:        bulkEditItem.CurriculumGroupId,
			Status:    bulkEditItem.Status,
			UpdatedAt: &now,
			UpdatedBy: &in.SubjectId,
		}
		_, err := service.schoolAffiliationStorage.CurriculumGroupUpdate(tx, &curriculumGroupEntity)
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
