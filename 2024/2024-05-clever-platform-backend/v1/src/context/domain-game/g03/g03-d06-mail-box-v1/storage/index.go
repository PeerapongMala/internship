package storage

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/storage/infrastructure/postgres"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/storage/storage-repository"

	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.MailBoxRepository {
	return postgres.RepositoryNew(resource)
	// 	return mysql.RepositoryNew(resource)
}
