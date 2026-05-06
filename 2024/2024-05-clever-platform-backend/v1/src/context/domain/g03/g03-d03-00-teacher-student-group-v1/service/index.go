package service

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-00-teacher-student-group-v1/storage/storage-repository"
	service01 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/service"
)

type serviceStruct struct {
	storage storageRepository.Repository
}

func NewService(storage storageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		storage: storage,
	}
}

type apiStruct struct {
	service   ServiceInterface
	service01 service01.ServiceInterface
}

func NewApiStruct(service ServiceInterface, service01 service01.ServiceInterface) apiStruct {
	return apiStruct{
		service:   service,
		service01: service01,
	}
}
