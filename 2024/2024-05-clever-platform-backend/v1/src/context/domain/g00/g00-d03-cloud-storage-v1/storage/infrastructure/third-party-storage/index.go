package thirdPartyStorage

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type thirdPartyStorageRepository struct {
	ThirdPartyStorageClient *s3.Client
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &thirdPartyStorageRepository{
		ThirdPartyStorageClient: resource.ThirdPartyClient,
	}
}
