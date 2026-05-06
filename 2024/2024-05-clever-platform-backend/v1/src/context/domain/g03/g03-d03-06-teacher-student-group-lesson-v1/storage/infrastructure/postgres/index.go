package postgres

import (
	storagerepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/storage/storage-repository"
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
