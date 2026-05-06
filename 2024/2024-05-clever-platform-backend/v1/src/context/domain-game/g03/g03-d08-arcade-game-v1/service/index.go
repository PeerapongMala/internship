package service

import (
	arcadeGameStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
)

func ServiceNew(arcadeGameStorage arcadeGameStorage.ArcadeGameRepository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		arcadeGameStorage: arcadeGameStorage,
		cloudStorage:      cloudStorage,
	}
}

type serviceStruct struct {
	arcadeGameStorage arcadeGameStorage.ArcadeGameRepository
	cloudStorage      cloudStorageRepository.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
