package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	academicProfileRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d07-academic-profile-v1/storage/storage-repository"
)

type serviceStruct struct {
	academicProfileStorage academicProfileRepository.Repository
	cloudStorage           cloudStorageRepository.Repository
}

func ServiceNew(academicProfileStorage academicProfileRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		academicProfileStorage: academicProfileStorage,
		cloudStorage:           cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
