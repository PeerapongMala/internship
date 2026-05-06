package googleTranslate

import (
	"cloud.google.com/go/translate"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d05-translate-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

type googleTranslateRepository struct {
	googleTranslateClient *translate.Client
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &googleTranslateRepository{
		googleTranslateClient: resource.GoogleTranslateClient,
	}
}
