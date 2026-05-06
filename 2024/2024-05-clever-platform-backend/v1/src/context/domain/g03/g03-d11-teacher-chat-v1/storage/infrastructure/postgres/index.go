package postgres

import (
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresTeacherChatRepository struct {
	Database *sqlx.DB
}

func RepositoryTeacherChat(resource coreInterface.Resource) storageRepository.RepositoryTeacherChat {
	return &postgresTeacherChatRepository{
		Database: resource.PostgresDatabase,
	}
}
