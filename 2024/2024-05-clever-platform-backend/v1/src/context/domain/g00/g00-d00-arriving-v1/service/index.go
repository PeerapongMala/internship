package service

import (
	arrivingStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
)

type serviceStruct struct {
	arrivingStorage arrivingStorageRepository.Repository
	cloudStorage    cloudStorageRepository.Repository
}

func ServiceNew(arrivingStorage arrivingStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		arrivingStorage: arrivingStorage,
		cloudStorage:    cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
