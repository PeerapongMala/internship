package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type AssetPreSignedUrlListResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant.GameAssetEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AssetPreSignedUrlList(context *fiber.Ctx) error {
	assetPreSignedUrlListOutput, err := api.Service.AssetPreSignedUrlList()
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AssetPreSignedUrlListResponse{
		StatusCode: http.StatusOK,
		Data:       assetPreSignedUrlListOutput.Urls,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AssetPreSignedUrlListOutput struct {
	Urls []constant.GameAssetEntity
}

func (service *serviceStruct) AssetPreSignedUrlList() (*AssetPreSignedUrlListOutput, error) {
	gameAssets, err := service.loginStorage.GameAssetList()
	if err != nil {
		return nil, err
	}

	for i, gameAsset := range gameAssets {
		if gameAsset.Url != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*gameAsset.Url)
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
