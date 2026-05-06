package service

import storagerepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/storage/storage-repository"

type serviceStruct struct {
	storage storagerepository.Repository
}

func NewService(storage storagerepository.Repository) ServiceInterface {
	return &serviceStruct{
		storage: storage,
	}
}

type ApiStruct struct {
	Service ServiceInterface
}

func NewAPIStruct(service ServiceInterface) *ApiStruct {
	return &ApiStruct{
		Service: service,
	}
}
