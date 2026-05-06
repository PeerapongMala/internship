package service

import storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1/storage/storage-repository"

type serviceStruct struct {
	helperStorage storageRepository.Repository
}

func ServiceNew(helperStorage storageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		helperStorage: helperStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
