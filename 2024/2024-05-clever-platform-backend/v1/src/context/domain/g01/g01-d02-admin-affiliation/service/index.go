package service

import (
	schoolAffiliationStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/storage/storage-repository"
)

type serviceStruct struct {
	schoolAffiliationStorage schoolAffiliationStorageRepository.Repository
}

func ServiceNew(schoolAffiliationStorage schoolAffiliationStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		schoolAffiliationStorage: schoolAffiliationStorage,
	}
}

type APiStruct struct {
	Service ServiceInterface
}
