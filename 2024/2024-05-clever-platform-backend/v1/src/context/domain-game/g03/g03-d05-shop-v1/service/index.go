package service

import (
	shopStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/storage/storage-repository"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
)

type serviceStruct struct {
	shopStorage  shopStorage.Repository
	cloudStorage cloudStorage.Repository
}

type APIStruct struct {
	Service ServiceInterface
}

type ItemShopResponse[T any] struct {
	Data       T      `json:"data"`
	Message    string `json:"message"`
	StatusCode int    `json:"status_code"`
}

func ServiceNew(storage shopStorage.Repository, cloudStorage cloudStorage.Repository) ServiceInterface {
	return &serviceStruct{
		shopStorage:  storage,
		cloudStorage: cloudStorage,
	}
}
