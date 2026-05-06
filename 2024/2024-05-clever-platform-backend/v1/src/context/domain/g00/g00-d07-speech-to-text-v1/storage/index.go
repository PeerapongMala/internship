package storage

import (
	googleSpeechToText "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1/storage/infrastructure/google-speech-to-text"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.Repository {
	return googleSpeechToText.RepositoryNew(resource)
}
