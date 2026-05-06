package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	gradePorphor6Repository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/storage/storage-repository"
)

type serviceStruct struct {
	gradePorphor6Storage gradePorphor6Repository.Repository
	authStorage          authStorageRepository.Repository
	cloudStorage         cloudStorageRepository.Repository
}

func ServiceNew(gradePorphor6Storage gradePorphor6Repository.Repository, authStorage authStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		gradePorphor6Storage: gradePorphor6Storage,
		authStorage:          authStorage,
		cloudStorage:         cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
