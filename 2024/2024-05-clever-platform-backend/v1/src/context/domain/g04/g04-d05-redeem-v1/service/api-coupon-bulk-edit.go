package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type CouponBulkEditRequest struct {
	BulkEditList []constant.CouponBulkEdit `json:"bulk_edit_list" validate:"required"`
	SubjectId    string
}

// ==================== Response ==========================
type CouponBulkEditResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) CouponBulkEdit(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &CouponBulkEditRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.CouponBulkEdit(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CouponBulkEditResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) CouponBulkEdit(in *CouponBulkEditRequest) error {

	sqlTx, err := service.redeemStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	now := time.Now().UTC()
	for _, bulkEdit := range in.BulkEditList {
		err := service.redeemStorage.UpdateCoupon(sqlTx, &constant.CouponEntity{
			Id:        bulkEdit.Id,
			Status:    bulkEdit.Status,
			UpdatedAt: &now,
			UpdatedBy: &in.SubjectId,
		})

		if err != nil {
			return err
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
