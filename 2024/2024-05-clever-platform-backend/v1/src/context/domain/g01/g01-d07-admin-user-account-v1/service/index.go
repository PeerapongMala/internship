package service

import (
	cloudStorageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	adminUserAccountRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/storage/storage-repository"
)

type serviceStruct struct {
	adminUserAccountStorage adminUserAccountRepository.Repository
	cloudStorage            cloudStorageRepository.Repository
	// authStorage authStorageRepository.Repository
	// authService authService.ServiceInterface
}

func ServiceNew(adminUserAccountStorage adminUserAccountRepository.Repository, cloudStorage cloudStorageRepository.Repository) ServiceInterface {
	return &serviceStruct{
		adminUserAccountStorage: adminUserAccountStorage,
		cloudStorage:            cloudStorage,
		// authStorage: authStorage,
		// authService: authService,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
