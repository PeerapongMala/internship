package service

import (
	repositoryStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/storage/storage-repository"
)

func ServiceNew(repositoryStorage repositoryStorage.Repository) ServiceInterface {
	return &serviceStruct{
		repositoryStorage: repositoryStorage,
	}
}

type serviceStruct struct {
	repositoryStorage repositoryStorage.Repository
}

type APIStruct struct {
	Service ServiceInterface
}
