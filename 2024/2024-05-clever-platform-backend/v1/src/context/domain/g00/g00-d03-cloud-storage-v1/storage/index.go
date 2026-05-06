package storage

import (
	"os"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/infrastructure/huawei-obs"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/infrastructure/third-party-storage"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
)

func StorageNew(resource coreInterface.Resource) storageRepository.Repository {
	cloudProvider := os.Getenv("CLOUD_STORAGE_PROVIDER")

	switch cloudProvider {
	case "THIRD_PARTY_STORAGE":
		return thirdPartyStorage.RepositoryNew(resource)
	default:
		return huaweiObs.RepositoryNew(resource)
	}
}
