package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) TeacherShopTransactionUpdateStatus(context *fiber.Ctx) error {
	transactionId, err := context.ParamsInt("storeTransactionId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	request, err := helper.ParseAndValidateRequest(context, &constant.ShopItemTransactionStatusRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	updateBy := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	request.UpdatedBy = &updateBy

	response, err := api.Service.TeacherShopTransactionUpdateStatus(transactionId, *request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(TeacherShopResponse[constant.ShopItemTransactionEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) TeacherShopTransactionUpdateStatus(transactionId int, c constant.ShopItemTransactionStatusRequest) (r constant.ShopItemTransactionEntity, err error) {
	return service.TeacherShopStorage.TeacherShopTransactionUpdateStatus(transactionId, c)
}
