package postgres

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/storage/storage-repository"
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
