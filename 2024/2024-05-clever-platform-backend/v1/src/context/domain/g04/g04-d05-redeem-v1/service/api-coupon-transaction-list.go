package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================
type CouponTransactionListRequest struct {
	CouponId int `param:"couponId"`
	*constant.CouponTransactionFilter
}

// ==================== Response ==========================

type CouponTransactionListResponse struct {
	StatusCode int                                    `json:"status_code"`
	Pagination *helper.Pagination                     `json:"_pagination"`
	Data       []constant.CouponTransactionListEntity `json:"data"`
	Message    string                                 `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) CouponTransactionList(context *fiber.Ctx) error {

	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &CouponTransactionListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp, err := api.Service.CouponTransactionList(&CouponTransactionListInput{
		CouponId:   request.CouponId,
		Pagination: pagination,
		Filter:     request.CouponTransactionFilter,
	})

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CouponTransactionListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       resp.CouponTransactions,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type CouponTransactionListInput struct {
	CouponId   int
	Pagination *helper.Pagination
	Filter     *constant.CouponTransactionFilter
}

type CouponTransactionListOutput struct {
	CouponTransactions []constant.CouponTransactionListEntity
}

func (service *serviceStruct) CouponTransactionList(in *CouponTransactionListInput) (*CouponTransactionListOutput, error) {

	couponTransactions, err := service.redeemStorage.GetCouponTransactionList(in.CouponId, in.Pagination, in.Filter)
	if err != nil {
		return nil, err
	}

	return &CouponTransactionListOutput{
		CouponTransactions: couponTransactions,
	}, nil
}
