package service

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	teacherItemStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/storage/storage-repository"
)

type serviceStruct struct {
	cloudStorage       cloudStorage.Repository
	teacherItemStorage teacherItemStorageRepository.Repository
}

func ServiceNew(teacherItemStorage teacherItemStorageRepository.Repository, cloudStorage cloudStorage.Repository) ServiceInterface {
	return &serviceStruct{
		teacherItemStorage: teacherItemStorage,
		cloudStorage:       cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
