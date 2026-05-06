package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	announceStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/storage/storage-repository"
)

func ServiceNew(announceStorage announceStorage.GmAnnounceRepository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		GmannounceStorage: announceStorage,
		cloudStorage:      cloudStorage,
	}
}

type serviceStruct struct {
	GmannounceStorage announceStorage.GmAnnounceRepository
	cloudStorage      cloudStorageRepository.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
