package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	itemStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/storage/storage-repository"
)

type serviceStruct struct {
	itemStorage  itemStorageRepository.Repository
	authStorage  authStorageRepository.Repository
	cloudStorage cloudStorage.Repository
}

func ServiceNew(itemStorage itemStorageRepository.Repository, authStorage authStorageRepository.Repository, cloudStorage cloudStorage.Repository) ServiceInterface {
	return &serviceStruct{
		itemStorage:  itemStorage,
		authStorage:  authStorage,
		cloudStorage: cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
