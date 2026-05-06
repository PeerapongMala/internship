package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) TeacherShopGet(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	storeItemId, err := context.ParamsInt("storeItemId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	response, err := api.Service.TeacherShopGet(storeItemId, teacherId, subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(TeacherShopResponse[constant.ShopItemResponse]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) TeacherShopGet(storeItemId int, teacherId string, subjectId int) (r constant.ShopItemResponse, err error) {
	shopItem, err := service.TeacherShopStorage.TeacherShopGet(storeItemId, teacherId, subjectId)
	if err != nil {
		return constant.ShopItemResponse{}, err
	}

	if shopItem.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*shopItem.ImageUrl)
		if err != nil {
			return constant.ShopItemResponse{}, err
		}
		shopItem.ImageUrl = url
	}

	shopItem.Stock = shopItem.TransactionCount
	return shopItem, nil
}
