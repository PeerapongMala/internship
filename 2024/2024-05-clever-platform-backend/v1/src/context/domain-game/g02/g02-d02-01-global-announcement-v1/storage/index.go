package storage

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/storage/storage-repository"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/storage/infrastructure/postgres"

	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.GlobalAnnounceRepository {
	return postgres.RepositoryNew(resource)
	// 	return mysql.RepositoryNew(resource)
}
