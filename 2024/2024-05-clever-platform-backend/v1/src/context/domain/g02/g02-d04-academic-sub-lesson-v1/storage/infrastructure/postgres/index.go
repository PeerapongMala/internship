package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

type AcademicSubLessonRepositoryInterface interface {
	CreateSubjectSubLesson(request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error)
	UpdateSubjectSubLesson(request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error)
	ListSubjectSubLesson(pagination *helper.Pagination, lessonId int, filter constant.SubLessonListFilter) (*[]constant.SubjectSubLessonResponse, error)
}

type AcademicSubLessonRepository struct {
	Db *sqlx.DB
}

func NewItemRepository(db *sqlx.DB) *AcademicSubLessonRepository {
	return &AcademicSubLessonRepository{Db: db}
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
