package service

import (
	adminFamilyRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/storage/storage-repository"
)

type serviceStruct struct {
	adminFamilyStorage adminFamilyRepository.Repository
}

func ServiceNew(adminFamilyStorage adminFamilyRepository.Repository) ServiceInterface {
	return &serviceStruct{
		adminFamilyStorage: adminFamilyStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
