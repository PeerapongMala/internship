package service

import (
	"log"
	"mime/multipart"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (api *APIStruct) CreateModelAsset(context *fiber.Ctx) error {
	asset, err := context.FormFile("asset")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	modelId := context.Params("modelId")

	err = api.Service.CreateModelAsset(modelId, asset)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Asset created successfully",
	})
}
func (service *serviceStruct) CreateModelAsset(modelId string, asset *multipart.FileHeader) error {
	var key *string
	if asset != nil {
		imageKey := uuid.NewString()
		key = &imageKey

	}
	err := service.cloudStorage.ObjectCreate(asset, *key, cloudStorageConstant.Image)
	if err != nil {
		log.Print(err)
		return err
	}
	err = service.ArcadeGameStorage.CreateModelAsset(modelId, key)
	if err != nil {
		log.Print(err)
		return err
	}
	return nil
}
