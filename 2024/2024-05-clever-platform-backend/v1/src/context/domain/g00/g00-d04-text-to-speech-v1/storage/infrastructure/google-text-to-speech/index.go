package googleTextToSpeech

import (
	texttospeech "cloud.google.com/go/texttospeech/apiv1"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d04-text-to-speech-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

type googleTextToSpeechRepository struct {
	googleTextToSpecchClient *texttospeech.Client
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &googleTextToSpeechRepository{
		googleTextToSpecchClient: resource.GoogleTextToSpeechClient,
	}
}
