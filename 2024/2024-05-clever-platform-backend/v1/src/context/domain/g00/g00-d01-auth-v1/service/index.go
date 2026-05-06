package service

import (
	authStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	userStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/storage/storage-repository"
)

func ServiceNew(authStorage authStorageRepository.Repository, userStorage userStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		authStorage: authStorage,
		userStorage: userStorage,
	}
}

type serviceStruct struct {
	authStorage authStorageRepository.Repository
	userStorage userStorageRepository.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
