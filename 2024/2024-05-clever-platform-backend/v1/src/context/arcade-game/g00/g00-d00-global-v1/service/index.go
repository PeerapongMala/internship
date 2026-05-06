package service

import (
	ArcadeGameStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
)

func ServiceNew(ArcadeGameStorage ArcadeGameStorage.ArcadeGameRepository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		ArcadeGameStorage: ArcadeGameStorage,
		cloudStorage:      cloudStorage,
	}
}

type serviceStruct struct {
	ArcadeGameStorage ArcadeGameStorage.ArcadeGameRepository
	cloudStorage      cloudStorageRepository.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
