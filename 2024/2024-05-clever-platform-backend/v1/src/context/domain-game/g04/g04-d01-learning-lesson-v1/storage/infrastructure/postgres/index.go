package postgres

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

type LearningLessonRepositoryInterface interface {
}

type LearningLessonRepository struct {
	Db *sqlx.DB
}

func NewItemRepository(db *sqlx.DB) *LearningLessonRepository {
	return &LearningLessonRepository{Db: db}
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
