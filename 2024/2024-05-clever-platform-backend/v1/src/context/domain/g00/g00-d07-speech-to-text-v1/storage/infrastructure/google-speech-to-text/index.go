package googleSpeechToText

import (
	speech "cloud.google.com/go/speech/apiv1"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

type googleSpeechToTextRepository struct {
	googleSpeechToTextClient *speech.Client
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &googleSpeechToTextRepository{
		googleSpeechToTextClient: resource.GoogleSpeechToTextClient,
	}
}
