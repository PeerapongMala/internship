package service

import storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/storage/storage-repository"

type serviceStruct struct {
	Storage storageRepository.Repository
}

func ServiceNew(Storage storageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		Storage: Storage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
