package service

import (
	loginStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/storage/storage-repository"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
)

type serviceStruct struct {
	loginStorage loginStorage.Repository
	cloudStorage cloudStorage.Repository
}

func ServiceNew(loginStorage loginStorage.Repository, cloudStorage cloudStorage.Repository) ServiceInterface {
	return &serviceStruct{
		loginStorage: loginStorage,
		cloudStorage: cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
