package storageRepository

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	CreateSubjectSubLesson(tx *sqlx.Tx, request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error)
	UpdateSubjectSubLesson(request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error)
	ListSubjectSubLesson(pagination *helper.Pagination, lessonId int, filter constant.SubLessonListFilter) (*[]constant.SubjectSubLessonListResponse, error)

	SubLessonGet(tx *sqlx.Tx, subLessonId int) (*constant.SubLessonDataEntity, error)
	SubLessonCaseSort(tx *sqlx.Tx, subLessons map[int]int, lessonId int) error
	CurriculumGroupCaseListContentCreator(curriculumGroupId int) ([]userConstant.UserEntity, error)
	SubLessonCaseGetCurriculumGroupId(subLessonId int) (*int, error)
	SubLessonCaseGetIndicator(subLessonId int) (*string, error)
	LessonCaseGetCurriculumGroupId(lessonId int) (*int, error)
	SubLessonCreate(tx *sqlx.Tx, subLesson *constant.SubLessonEntity) (*constant.SubLessonEntity, error)
	SubLessonUpdate(tx *sqlx.Tx, subLesson *constant.SubLessonEntity) (*constant.SubLessonEntity, error)
	SubLessonCaseCheckDuplicateIndex(tx *sqlx.Tx, lessonId, index int) (*bool, error)
	IndicatorCaseGetByShortName(tx *sqlx.Tx, shortName string, curriculumGroupId int) (*int, error)

	SubLessonPrefill(tx *sqlx.Tx, lessonId, subLessonId int) error
}
