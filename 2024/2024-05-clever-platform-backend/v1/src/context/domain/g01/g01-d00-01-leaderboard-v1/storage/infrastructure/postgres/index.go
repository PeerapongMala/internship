package postgres

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/storage/storage-repository"

	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"

	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

// LeaderboardUpdate implements storageRepository.LeaderboardRepository.

// LeaderboardUpdate implements storageRepository.LeaderboardRepository.

// LeaderboardUpdate implements storageRepository.LeaderboardRepository.

func RepositoryNew(resource coreInterface.Resource) storageRepository.LeaderboardRepository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
