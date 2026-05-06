package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"

	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
