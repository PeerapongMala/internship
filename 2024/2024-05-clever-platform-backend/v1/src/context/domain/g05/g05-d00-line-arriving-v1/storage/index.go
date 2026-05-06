package storage

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d00-line-arriving-v1/storage/infrastructure/postgres"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d00-line-arriving-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.Repository {
	return postgres.RepositoryNew(resource)
}
