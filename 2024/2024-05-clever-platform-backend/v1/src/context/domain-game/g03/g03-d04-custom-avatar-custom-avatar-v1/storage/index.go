package storage

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/storage/infrastructure/postgres"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/storage/storage-respository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.CustomAvatarRepository {
	return postgres.RepositoryNew(resource)
}
