package storage

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1/storage/infrastructure/postgres"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storage.Repository {
	return postgres.RepositoryNew(resource)
}
