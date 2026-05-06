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

type ItemUpdateResponse struct {
	Message    string `json:"message"`
	StatusCode int    `json:"status_code"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.ItemRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.UpdateAt = time.Now()

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
	request.UpdateAt = time.Now().UTC()

	_, err = api.Service.ItemUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemUpdateResponse{
		Message:    "Item updated",
		StatusCode: fiber.StatusOK,
	})

}

// ==================== Service ==========================

func (service *serviceStruct) ItemUpdate(request *constant.ItemRequest) (*constant.ItemResponse, error) {
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

	saved, err := service.itemStorage.UpdateItem(request)
	if err != nil {
		return nil, err
	}

	return saved, nil
}
