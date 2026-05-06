package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Response ==========================
type CouponGetResponse struct {
	Data *constant.CouponEntity	`json:"data"`
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) CouponGet(context *fiber.Ctx) error {

	couponId, err := context.ParamsInt("id")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.CouponGet(couponId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CouponGetResponse{
		Data: resp,
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) CouponGet(id int) (*constant.CouponEntity, error) {

	resp, err := service.redeemStorage.GetCouponById(id)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
