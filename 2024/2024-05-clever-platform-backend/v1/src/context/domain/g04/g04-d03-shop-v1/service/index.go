package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	shopStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/storage/storage-repository"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type serviceStruct struct {
	shopStorage shopStorageRepository.ShopRepository
	authStorage authStorageRepository.Repository
}

func ServiceNew(shopStorage shopStorageRepository.ShopRepository, authStorage authStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		shopStorage: shopStorage,
		authStorage: authStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}

type ItemShopResponse[T any] struct {
	Data       T      `json:"data"`
	Message    string `json:"message"`
	StatusCode int    `json:"status_code"`
}

type ItemShopListsResponse[T any] struct {
	Data       T                  `json:"data"`
	Message    string             `json:"message"`
	Pagination *helper.Pagination `json:"_pagination"`
	StatusCode int                `json:"status_code"`
}
