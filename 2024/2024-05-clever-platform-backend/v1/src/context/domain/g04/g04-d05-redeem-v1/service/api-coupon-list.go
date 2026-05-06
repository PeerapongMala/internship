package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type CouponListRequest struct {
	*constant.CouponFilter
}

// ==================== Response ==========================

type CouponListResponse struct {
	StatusCode int                         `json:"status_code"`
	Pagination *helper.Pagination          `json:"_pagination"`
	Data       []constant.CouponListEntity `json:"data"`
	Message    string                      `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) CouponList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &CouponListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	
	couponListOutput, err := api.Service.CouponList(&CouponListInput{
		Pagination: pagination,
		CouponFilter: request.CouponFilter,
	})

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CouponListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       couponListOutput.Coupons,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type CouponListInput struct {
	Pagination   *helper.Pagination
	CouponFilter *constant.CouponFilter
}

type CouponListOutput struct {
	Coupons []constant.CouponListEntity
}

func (service *serviceStruct) CouponList(in *CouponListInput) (*CouponListOutput, error) {
	
	if in.CouponFilter == nil {
		in.CouponFilter = &constant.CouponFilter{}
	}
	
	coupons, err := service.redeemStorage.GetCouponList(in.Pagination, in.CouponFilter)
	if err != nil {
		return nil, err
	}

	return &CouponListOutput{
		Coupons: coupons,
	}, nil
}
