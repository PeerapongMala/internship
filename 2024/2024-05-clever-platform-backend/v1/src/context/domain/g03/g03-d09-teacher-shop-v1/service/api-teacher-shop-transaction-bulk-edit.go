package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) TeacherShopTransactionUpdateStatusBulkEdit(context *fiber.Ctx) error {
	var request = constant.ShopItemTransactionStatusBulkEditRequest{}

	body, err := helper.ParseAndValidateRequest(context, &request, helper.ParseOptions{
		Body: true,
	})

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	response, err := api.Service.TeacherShopTransactionUpdateStatusBulkEdit(*body)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(TeacherShopResponse[[]constant.ShopItemTransactionEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) TeacherShopTransactionUpdateStatusBulkEdit(items constant.ShopItemTransactionStatusBulkEditRequest) (r []constant.ShopItemTransactionEntity, err error) {
	return service.TeacherShopStorage.TeacherShopTransactionUpdateStatusBulkEdit(items.Items)
}
