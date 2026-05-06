package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type UserCaseBulkEditRequest struct {
	BulkEditList []constant.UserBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
}

// ==================== Response ==========================

type UserCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UserCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &UserCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.UserCaseBulkEdit(&UserCaseBulkEditInput{
		SubjectId:               subjectId,
		UserCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(UserCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type UserCaseBulkEditInput struct {
	SubjectId string
	*UserCaseBulkEditRequest
}

func (service *serviceStruct) UserCaseBulkEdit(in *UserCaseBulkEditInput) error {
	tx, err := service.adminUserAccountStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		now := time.Now().UTC()

		userEntity := constant.UserEntity{
			Id:        bulkEditItem.UserId,
			Status:    bulkEditItem.Status,
			UpdatedAt: &now,
			UpdatedBy: &in.SubjectId,
		}
		_, err := service.adminUserAccountStorage.UserUpdate(tx, &userEntity)
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
