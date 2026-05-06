package service

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/storage/storage-repository"
)

type serviceStruct struct {
	storage storageRepository.Repository
}

func ServiceNew(repository storageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		storage: repository,
	}
}

type APiStruct struct {
	Service ServiceInterface
}
