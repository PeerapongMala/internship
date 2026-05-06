package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	teacherProfileRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1/storage/storage-repository"
)

type serviceStruct struct {
	teacherProfileStorage teacherProfileRepository.Repository
	cloudStorage          cloudStorageRepository.Repository
}

func ServiceNew(teacherProfileStorage teacherProfileRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		teacherProfileStorage: teacherProfileStorage,
		cloudStorage:          cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
