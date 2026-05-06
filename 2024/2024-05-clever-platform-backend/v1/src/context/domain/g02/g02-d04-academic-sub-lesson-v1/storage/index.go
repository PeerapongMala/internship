package storage

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/storage/infrastructure/postgres"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.Repository {
	return postgres.RepositoryNew(resource)
}
