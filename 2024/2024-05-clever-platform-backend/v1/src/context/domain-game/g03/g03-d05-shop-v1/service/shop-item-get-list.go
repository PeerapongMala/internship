package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type GetShopItemListRequest struct {
	SubjectId int    `query:"subject_id" validate:"required"`
	Type      string `query:"type" validate:"required"`
	StudentId string
}

func (api *APIStruct) GetShopItemLists(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &GetShopItemListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.StudentId = studentId

	response, err := api.Service.GetShopItemLists(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[[]constant.ShopItem]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) GetShopItemLists(c *GetShopItemListRequest) (r []constant.ShopItem, err error) {
	classId, err := service.shopStorage.CurrentClassGet(c.StudentId)
	if err != nil {
		return nil, err
	}

	studyGroupIds, err := service.shopStorage.StudyGroupList(classId, c.SubjectId, c.StudentId)
	if err != nil {
		return nil, err
	}

	shopItems, err := service.shopStorage.GetShopItemLists(c.SubjectId, c.Type, c.StudentId, classId, studyGroupIds)
	if err != nil {
		return nil, err
	}

	for i, shopItem := range shopItems {
		if shopItem.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*shopItem.ImageUrl)
			if err != nil {
				return nil, err
			}
			shopItems[i].ImageUrl = url
		}
	}

	return shopItems, nil
}
