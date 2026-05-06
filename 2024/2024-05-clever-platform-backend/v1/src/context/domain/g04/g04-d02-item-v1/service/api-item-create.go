package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
	"net/http"
	"time"
)

// ==================== Response ==========================

type ItemCreateResponse struct {
	Message    string `json:"message"`
	StatusCode int    `json:"status_code"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.ItemRequest{})
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

	_, err = api.Service.ItemCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemCreateResponse{
		Message:    "Item created",
		StatusCode: fiber.StatusOK,
	})

}

// ==================== Service ==========================

func (service *serviceStruct) ItemCreate(request *constant.ItemRequest) (*constant.ItemResponse, error) {
	request.CreateAt = time.Now()
	if request.Image != nil {
		key := uuid.NewString()
		err := service.cloudStorage.ObjectCreate(request.Image, key, constant2.Image)
		if err != nil {
			return nil, err
		}
		request.ImageUrl = &key
	}

	item, err := service.itemStorage.CreateItem(request)
	if err != nil {
		return nil, err
	}

	return item, nil
}
