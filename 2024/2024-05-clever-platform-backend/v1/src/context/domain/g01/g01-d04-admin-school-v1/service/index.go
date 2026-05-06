package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	adminSchoolStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/storage/storage-repository"
)

type serviceStruct struct {
	adminSchoolStorage adminSchoolStorageRepository.Repository
	cloudStorage       cloudStorageRepository.Repository
}

func ServiceNew(adminSchoolStorage adminSchoolStorageRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		adminSchoolStorage: adminSchoolStorage,
		cloudStorage:       cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
