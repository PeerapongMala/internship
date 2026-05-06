package postgres

import (
	lineParentRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

func Repository(resource coreInterface.Resource) lineParentRepository.Repository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
