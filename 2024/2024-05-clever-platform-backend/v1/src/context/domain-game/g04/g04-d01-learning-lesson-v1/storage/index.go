package storage

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/storage/infrastructure/postgres"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.Repository {
	return postgres.RepositoryNew(resource)
}
