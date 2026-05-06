package postgres

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.GmAnnounceRepository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
