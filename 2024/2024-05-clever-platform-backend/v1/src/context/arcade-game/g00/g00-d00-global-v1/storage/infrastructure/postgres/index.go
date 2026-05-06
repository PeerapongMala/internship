package postgres

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.ArcadeGameRepository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
