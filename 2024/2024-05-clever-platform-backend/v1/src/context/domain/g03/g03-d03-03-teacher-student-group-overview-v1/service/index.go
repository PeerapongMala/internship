package service

import storagerepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/storage/storage-repository"

type serviceStruct struct {
	storage storagerepository.Repository
}

func NewService(storage storagerepository.Repository) ServiceInterface {
	return &serviceStruct{
		storage: storage,
	}
}

type apiStruct struct {
	service ServiceInterface
}

func NewAPIStruct(service ServiceInterface) apiStruct {
	return apiStruct{
		service: service,
	}
}
