package postgres

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresTeacherStudentRepository struct {
	Database *sqlx.DB
}

func RepositoryTeacherStudentNew(resource coreInterface.Resource) storageRepository.RepositoryTeacherStudent {
	return &postgresTeacherStudentRepository{
		Database: resource.PostgresDatabase,
	}
}
