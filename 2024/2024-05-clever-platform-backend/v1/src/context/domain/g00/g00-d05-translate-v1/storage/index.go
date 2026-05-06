package storage

import (
	googleTranslate "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d05-translate-v1/storage/infrastructure/google-translate"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d05-translate-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.Repository {
	return googleTranslate.RepositoryNew(resource)
}
