package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strings"
)

// ==================== Request ==========================

// ==================== Response ==========================

type AssetZipPreSignedUrlListResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant.GameAssetEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AssetZipPreSignedUrlList(context *fiber.Ctx) error {
	assetPreSignedUrlListOutput, err := api.Service.AssetZipPreSignedUrlList()
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AssetZipPreSignedUrlListResponse{
		StatusCode: http.StatusOK,
		Data:       assetPreSignedUrlListOutput.Urls,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AssetZipPreSignedUrlListOutput struct {
	Urls []constant.GameAssetEntity
}

func (service *serviceStruct) AssetZipPreSignedUrlList() (*AssetPreSignedUrlListOutput, error) {
	gameAssets, err := service.loginStorage.GameAssetList()
	if err != nil {
		return nil, err
	}

	for i, gameAsset := range gameAssets {
		if gameAsset.Url != nil {
			zipUrl := helper.ToPtr(strings.ReplaceAll(*gameAsset.Url, ".fbx", ".fbx.zip"))
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*zipUrl)
			if err != nil {
				return nil, err
			}
			gameAssets[i].Url = url
		}
	}

	return &AssetPreSignedUrlListOutput{
		Urls: gameAssets,
	}, nil
}
