package service

import (
	"database/sql"
	"log"
	"net/http"

	arcadehelper "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/arcade-helper"
	// _ cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	// "github.com/google/uuid"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetAssetByModelId(context *fiber.Ctx) error {
	Token := context.Get("Authorization")
	fileData, contentType, err := api.Service.GetAssetByModelId(Token)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", contentType)
	return context.Status(http.StatusOK).Send(fileData)
}
func (service *serviceStruct) GetAssetByModelId(Token string) ([]byte, string, error) {

	var url *string
	claims, err := arcadehelper.ValidateJwtArcadeGameBaerer(Token)
	if err != nil {
		return nil, "", err
	}
	inventoryId, err := service.ArcadeGameStorage.GetInventoryId(claims.Subject)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, "", err

	}
	ModelId, err := service.ArcadeGameStorage.GetModelByInventoryId(inventoryId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, "", err

	}
	Asset, err := service.ArcadeGameStorage.GetAssetByModelId(ModelId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, "", helper.NewHttpError(http.StatusNotFound, nil)
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, "", err
	}
	// var key *string
	// if Asset != nil {
	// 	imageKey := uuid.NewString()
	// 	key = &imageKey

	// }
	// err = service.cloudStorage.ObjectCreate(Asset, *key, cloudStorageConstant.Image)
	// if err != nil {
	// 	return nil, "", err
	// }

	if Asset != nil {
		url, err = service.cloudStorage.ObjectCaseGenerateSignedUrl(*Asset)
		if err != nil {
			return nil, "", err
		}
	} else {
		return nil, "", helper.NewHttpError(http.StatusNotFound, nil)
	}
	fileData, contentType, err := helper.DownloadImageFileFromUrl(url)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, "", err
	}
	return fileData, contentType, nil
}
