package service

import termsStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/storage/storage-repository"

type serviceStruct struct {
	termsStorage termsStorageRepository.Repository
}

func ServiceNew(termsStorage termsStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		termsStorage: termsStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
