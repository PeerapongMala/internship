package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) SubjectList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	filter, err := helper.ParseAndValidateRequest(context, &constant.OverViewStatusFilter{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	log.Println("filter: ", filter)

	data, err := api.Service.SubjectList(filter, pagination)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) SubjectList(in *constant.OverViewStatusFilter, pagination *helper.Pagination) ([]*constant.Subject, error) {
	data, err := service.lineParentStorage.SubjectList(in, pagination)
	if err != nil {
		return nil, err
	}
	return data, nil
}
