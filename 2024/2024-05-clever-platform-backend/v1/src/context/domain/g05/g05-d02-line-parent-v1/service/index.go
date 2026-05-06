package service

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	adminFamilyRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/storage/storage-repository"
	lineParentStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/storage/storage-repository"
)

type serviceStruct struct {
	lineParentStorage lineParentStorageRepository.Repository
	familyStorage     adminFamilyRepository.Repository
	cloudStorage      cloudStorage.Repository
}

func ServiceNew(lineParentStorage lineParentStorageRepository.Repository, familyStorage adminFamilyRepository.Repository, cloudStorage cloudStorage.Repository) ServiceInterface {
	return &serviceStruct{
		lineParentStorage: lineParentStorage,
		familyStorage:     familyStorage,
		cloudStorage:      cloudStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
