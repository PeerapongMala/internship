package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) TeacherShopTransactionList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant.TeacherShopListFilter{}
	err := context.ParamsParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	storeItemId, err := context.ParamsInt("storeItemId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	response, err := api.Service.TeacherShopTransactionList(pagination, &filter, storeItemId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(TeacherShopListResponse[[]constant.ShopItemTransactionResponse]{
		Message:    "success",
		Data:       response,
		Pagination: pagination,
		StatusCode: fiber.StatusOK,
	})

}
func (service serviceStruct) TeacherShopTransactionList(pagination *helper.Pagination, filter *constant.TeacherShopListFilter, storeItemId int) (r []constant.ShopItemTransactionResponse, err error) {
	return service.TeacherShopStorage.TeacherShopTransactionList(pagination, filter, storeItemId)
}
