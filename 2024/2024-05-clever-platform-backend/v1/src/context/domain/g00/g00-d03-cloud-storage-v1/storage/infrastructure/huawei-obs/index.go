package huaweiObs

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	obs "github.com/huaweicloud/huaweicloud-sdk-go-obs/obs"
)

type huaweiObsRepository struct {
	ObsClient *obs.ObsClient
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &huaweiObsRepository{
		ObsClient: resource.ObsClient,
	}
}
