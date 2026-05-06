package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	gamemasterProfileStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d07-gamemaster-profile-v1/storage/storage-repository"
)

type serviceStruct struct {
	gamemasterProfileStorage gamemasterProfileStorageRepository.Repository
	cloudStorage             cloudStorageRepository.Repository
}

func ServiceNew(gamemasterProfileStorage gamemasterProfileStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		gamemasterProfileStorage: gamemasterProfileStorage,
		cloudStorage:             cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
