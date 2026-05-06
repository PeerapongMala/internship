package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type CouponTransactionListRequest struct {
	constant.CouponTransactionFilter
}

// ==================== Response ==========================

type CouponTransactionListResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.CouponTransaction `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) CouponTransactionList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &CouponTransactionListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	request.CouponTransactionFilter.TeacherId = subjectId
	couponTransactionListOutput, err := api.Service.CouponTransactionList(&CouponTransactionListInput{
		Pagination:                   pagination,
		CouponTransactionListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CouponTransactionListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       couponTransactionListOutput.Transactions,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type CouponTransactionListInput struct {
	Pagination *helper.Pagination
	*CouponTransactionListRequest
}

type CouponTransactionListOutput struct {
	Transactions []constant.CouponTransaction
}

func (service *serviceStruct) CouponTransactionList(in *CouponTransactionListInput) (*CouponTransactionListOutput, error) {
	transactions, err := service.teacherRewardStorage.CouponTransactionList(&in.CouponTransactionFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &CouponTransactionListOutput{
		transactions,
	}, nil
}
