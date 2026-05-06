package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type ItemCaseBulkEditRequest struct {
	BulkEditList []constant.ItemBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
}

// ==================== Response ==========================

type ItemCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ItemCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ItemCaseBulkEdit(&ItemCaseBulkEditInput{
		ItemCaseBulkEditRequest: request,
		SubjectId: subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ItemCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message: "Edited",
	})
}

// ==================== Service ==========================

type ItemCaseBulkEditInput struct {
	*ItemCaseBulkEditRequest
	SubjectId string
}

func (service *serviceStruct) ItemCaseBulkEdit(in *ItemCaseBulkEditInput) error {
	tx, err := service.itemStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		_, err := service.itemStorage.UpdateItem(&constant.ItemRequest{
			Id: bulkEditItem.Id,
			Status: &bulkEditItem.Status,
			UpdateAt: time.Now().UTC(),
			UpdateBy: &in.SubjectId,
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
