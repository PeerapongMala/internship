package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

type AcademicLessonRepositoryInterface interface {
	ListSubjectLesson(pagination *helper.Pagination, subjectId int, filter constant.LessonListFilter) (*[]constant.SubjectLessonResponse, error)
	CreateSubjectLesson(request *constant.SubjectLessonCreateRequest) (*constant.SubjectLessonResponse, error)
	UpdateSubjectLesson(request *constant.SubjectLessonCreateRequest) (*constant.SubjectLessonResponse, error)
}

type AcademicLessonRepository struct {
	Db *sqlx.DB
}

func NewItemRepository(db *sqlx.DB) *AcademicLessonRepository {
	return &AcademicLessonRepository{Db: db}
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
