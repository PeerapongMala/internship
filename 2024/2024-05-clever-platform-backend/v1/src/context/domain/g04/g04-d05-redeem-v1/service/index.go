package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	redeemRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/storage/storage-repository"
)

type serviceStruct struct {
	redeemStorage redeemRepository.Repository
	cloudStorage  cloudStorageRepository.Repository
}

func ServiceNew(redeemStorage redeemRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		redeemStorage: redeemStorage,
		cloudStorage:  cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
