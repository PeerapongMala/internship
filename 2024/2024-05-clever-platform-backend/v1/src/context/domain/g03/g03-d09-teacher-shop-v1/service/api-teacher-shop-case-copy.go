package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherShopCaseCopyRequest struct {
	Id int `params:"teacherShopItemId" validate:"required"`
}

type TeacherShopCaseCopyResponse struct {
	StatusCode int                 `json:"status_code"`
	Data       []constant.ShopItem `json:"data"`
	Message    string              `json:"message"`
}

func (api *APIStruct) TeacherShopCaseCopy(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherShopCaseCopyRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	teacherShopCaseCopyOutput, err := api.Service.TeacherShopCaseCopy(&TeacherShopCaseCopyInput{
		TeacherId:                  subjectId,
		TeacherShopCaseCopyRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusCreated).JSON(TeacherShopCaseCopyResponse{
		StatusCode: fiber.StatusCreated,
		Data:       []constant.ShopItem{*teacherShopCaseCopyOutput.ShopItem},
		Message:    "Data retrieved",
	})
}

type TeacherShopCaseCopyInput struct {
	TeacherId string
	*TeacherShopCaseCopyRequest
}

type TeacherShopCaseCopyOutput struct {
	*constant.ShopItem
}

func (service *serviceStruct) TeacherShopCaseCopy(in *TeacherShopCaseCopyInput) (*TeacherShopCaseCopyOutput, error) {
	teacherShopItem, err := service.TeacherShopStorage.TeacherShopItemGet(in.Id)
	if err != nil {
		return nil, err
	}

	if teacherShopItem.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*teacherShopItem.ImageUrl)
		if err != nil {
			return nil, err
		}
		teacherShopItem.ImageUrl = url
	}
	return &TeacherShopCaseCopyOutput{
		ShopItem: teacherShopItem,
	}, nil
}
