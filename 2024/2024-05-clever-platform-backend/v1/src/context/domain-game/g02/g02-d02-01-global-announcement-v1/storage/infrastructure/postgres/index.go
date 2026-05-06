package postgres

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.GlobalAnnounceRepository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
