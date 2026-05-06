package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	gamificationRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/storage/storage-repository"
)

type serviceStruct struct {
	gamificationStorage gamificationRepository.Repository
	cloudStorage        cloudStorageRepository.Repository
}

func ServiceNew(gamificationStorage gamificationRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		gamificationStorage: gamificationStorage,
		cloudStorage:        cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
