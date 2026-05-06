package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) TeacherShopLists(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)
	filter := constant.TeacherShopListFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	response, err := api.Service.TeacherShopLists(pagination, &filter, subjectId, teacherId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(TeacherShopListResponse[[]constant.ShopItemResponse]{
		Data:       response,
		Message:    "success",
		Pagination: pagination,
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) TeacherShopLists(pagination *helper.Pagination, filter *constant.TeacherShopListFilter, subjectId int, teacherId string) (r []constant.ShopItemResponse, err error) {
	shopItems, err := service.TeacherShopStorage.TeacherShopLists(pagination, filter, subjectId, teacherId)
	if err != nil {
		return nil, err
	}

	for i, shopItem := range shopItems {
		//if shopItem.InitialStock != nil {
		//	sold := helper.Deref(shopItem.InitialStock) - helper.Deref(shopItem.Stock)
		//	shopItems[i].Stock = &sold
		//} else {
		shopItems[i].Stock = shopItem.TransactionCount
		//}
	}

	return shopItems, err
}
