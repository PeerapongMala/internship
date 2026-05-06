package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================

type ItemBadgeUpdateResponse struct {
	Message    string `json:"message"`
	StatusCode int    `json:"status_code"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemBadgeUpdate(context *fiber.Ctx) error {
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
	request.UpdateBy = &subjectId
	// data update Item

	_, err = api.Service.ItemBadgeUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemBadgeUpdateResponse{
		Message:    "Item badge updated",
		StatusCode: fiber.StatusOK,
	})

}

// ==================== Service ==========================

func (service *serviceStruct) ItemBadgeUpdate(request *constant.ItemAndBadgeResponse) (*constant.ItemBadgeResponse, error) {
	item, err := service.itemStorage.GetItemBadge(request.Id)
	if err != nil {
		return nil, err
	}

	if request.ImageUrl != nil || request.Image != nil {
		if item.ImageUrl != nil {
			err := service.cloudStorage.ObjectDelete(*request.ImageUrl)
			if err != nil {
				return nil, err
			}
		}
	}

	if request.Image != nil {
		key := uuid.NewString()
		err := service.cloudStorage.ObjectCreate(request.Image, key, constant2.Image)
		if err != nil {
			return nil, err
		}
		request.ImageUrl = &key
	}

	_, err = service.itemStorage.UpdateItem(&constant.ItemRequest{
		Id:           request.Id,
		Type:         request.Type,
		Name:         request.Name,
		Description:  request.Description,
		ImageUrl:     request.ImageUrl,
		Status:       request.Status,
		UpdateAt:     time.Now(),
		UpdateBy:     request.UpdateBy,
		AdminLoginAs: request.AdminLoginAs,
	})
	if err != nil {
		return nil, err
	}

	saved, err := service.itemStorage.UpdateItemBadge(&constant.ItemBadgeRequest{
		ItemId:           request.Id,
		TemplatePath:     request.TemplatePath,
		BadgeDescription: request.BadgeDescription,
	})
	if err != nil {
		return nil, err
	}

	return saved, nil
}
