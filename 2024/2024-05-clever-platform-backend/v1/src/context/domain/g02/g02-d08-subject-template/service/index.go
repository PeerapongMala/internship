package service

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/storage/storage-repository"
)

type serviceStruct struct {
	subjectTemplateStorage storageRepository.Repository
}

func ServiceNew(subjectTemplateStorage storageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		subjectTemplateStorage: subjectTemplateStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
