package service

import storagerepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/storage/storage-repository"

type serviceStruct struct {
	storage storagerepository.Repository
}

func NewService(storage storagerepository.Repository) ServiceInterface {
	return &serviceStruct{
		storage: storage,
	}
}

type apiStruct struct {
	Service ServiceInterface
}

func NewAPIStruct(service ServiceInterface) apiStruct {
	return apiStruct{
		Service: service,
	}
}
