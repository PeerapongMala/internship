package postgres

import (
	storagerepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

func NewPostgresRepository(resource coreInterface.Resource) storagerepository.Repository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
