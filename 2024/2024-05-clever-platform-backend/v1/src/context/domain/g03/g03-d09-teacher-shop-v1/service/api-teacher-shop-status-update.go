package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) TeacherShopUpdateStatus(context *fiber.Ctx) error {

	storeItemId, err := context.ParamsInt("storeItemId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	request, err := helper.ParseAndValidateRequest(context, &constant.ShopItemStatusRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	updateBy := context.Locals("subjectId").(string)
	request.UpdatedBy = &updateBy

	response, err := api.Service.TeacherShopUpdateStatus(storeItemId, *request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(TeacherShopResponse[constant.ShopItemEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})

}

func (service *serviceStruct) TeacherShopUpdateStatus(storeItemId int, c constant.ShopItemStatusRequest) (r constant.ShopItemEntity, err error) {
	return service.TeacherShopStorage.TeacherShopUpdateStatus(storeItemId, c)
}
