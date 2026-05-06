package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================
type GradePorphor6ListResponse struct {
	StatusCode int                             `json:"status_code"`
	Pagination *helper.Pagination              `json:"_pagination"`
	Data       []constant.Porphor6ListResponse `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) GradePorphor6List(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request := constant.GradePorphor6ListRequest{}
	err := context.QueryParser(&request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.GradePorphor6List(request, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(GradePorphor6ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: pagination,
		Data:       *data,
		Message:    "Grade porphor6 list",
	})

}

// ==================== Service ==========================
func (service *serviceStruct) GradePorphor6List(request constant.GradePorphor6ListRequest, pagination *helper.Pagination) (*[]constant.Porphor6ListResponse, error) {
	porphor6, err := service.gradePorphor6Storage.GradePorphor6List(request, pagination)
	if err != nil {
		return nil, err
	}

	return porphor6, nil
}
