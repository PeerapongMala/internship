package service

import (
	announceStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
)

func ServiceNew(GlobalAnnounceStorage announceStorage.GlobalAnnounceRepository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		globalAnnounceStorage: GlobalAnnounceStorage,
		cloudStorage:          cloudStorage,
	}
}

type serviceStruct struct {
	globalAnnounceStorage announceStorage.GlobalAnnounceRepository
	cloudStorage          cloudStorageRepository.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
