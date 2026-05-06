package storage

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/storage/infrastructure/postgres"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.Repository {
	return postgres.RepositoryNew(resource)
}
