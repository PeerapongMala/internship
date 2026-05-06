package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================

type ItemBadgeCreateResponse struct {
	Message    string `json:"message"`
	StatusCode int    `json:"status_code"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemBadgeCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.ItemAndBadgeResponse{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	image, err := context.FormFile("image")
	if err != nil && err != fasthttp.ErrMissingFile {
		return helper.RespondHttpError(context, err)
	}
	request.Image = image

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.CreateBy = &subjectId
	log.Println(request.TemplatePath)

	_, err = api.Service.ItemBadgeCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemBadgeCreateResponse{
		Message:    "Item created",
		StatusCode: fiber.StatusOK,
	})

	// return nil

}

// ==================== Service ==========================

func (service *serviceStruct) ItemBadgeCreate(request *constant.ItemAndBadgeResponse) (*constant.ItemBadgeResponse, error) {
	if request.Image != nil {
		key := uuid.NewString()
		err := service.cloudStorage.ObjectCreate(request.Image, key, constant2.Image)
		if err != nil {
			return nil, err
		}
		request.ImageUrl = &key
	}

	itemRequest := &constant.ItemRequest{
		Type:         request.Type,
		Name:         request.Name,
		Description:  request.Description,
		ImageUrl:     request.ImageUrl,
		Status:       request.Status,
		CreateAt:     time.Now(),
		CreateBy:     request.CreateBy,
		AdminLoginAs: request.AdminLoginAs,
	}

	responseItem, err := service.ItemCreate(itemRequest)
	if err != nil {
		return nil, err
	}

	itemBadgeRequest := &constant.ItemBadgeRequest{
		ItemId:           responseItem.Id,
		TemplatePath:     request.TemplatePath,
		BadgeDescription: request.BadgeDescription,
	}

	item, err := service.itemStorage.CreateItemBadge(itemBadgeRequest)
	if err != nil {
		return nil, err
	}

	return item, nil
}
