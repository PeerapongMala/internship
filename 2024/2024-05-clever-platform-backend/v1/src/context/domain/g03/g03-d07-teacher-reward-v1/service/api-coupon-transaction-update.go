package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type CouponTransactionUpdateRequest struct {
	CouponTransactionId int    `params:"couponTransactionId" validate:"required"`
	Status              string `json:"status" validate:"required"`
}

// ==================== Response ==========================

type CouponTransactionUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) CouponTransactionUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &CouponTransactionUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.CouponTransactionUpdate(&CouponTransactionUpdateInput{
		CouponTransactionUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(CouponTransactionUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "updated",
	})
}

// ==================== Service ==========================

type CouponTransactionUpdateInput struct {
	*CouponTransactionUpdateRequest
}

func (service *serviceStruct) CouponTransactionUpdate(in *CouponTransactionUpdateInput) error {
	err := service.teacherRewardStorage.CouponTransactionUpdate(in.CouponTransactionId, in.Status)
	if err != nil {
		return err
	}
	return nil
}
