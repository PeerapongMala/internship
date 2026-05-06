package storage

import (
	googleTextToSpeech "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d04-text-to-speech-v1/storage/infrastructure/google-text-to-speech"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d04-text-to-speech-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.Repository {
	return googleTextToSpeech.RepositoryNew(resource)
}
