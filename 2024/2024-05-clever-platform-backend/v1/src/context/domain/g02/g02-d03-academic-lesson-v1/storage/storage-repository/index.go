package storageRepository

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	ListSubjectLesson(pagination *helper.Pagination, subjectId int, filter constant.LessonListFilter) (*[]constant.SubjectLessonResponse, error)
	CreateSubjectLesson(tx *sqlx.Tx, request *constant.SubjectLessonCreateRequest) (*constant.SubjectLessonResponse, error)
	UpdateSubjectLesson(request *constant.SubjectLessonPatchRequest) (*constant.SubjectLessonResponse, error)

	LessonGet(tx *sqlx.Tx, lessonId int) (*constant.LessonDataEntity, error)
	LessonCaseGetCurriculumGroupId(lessonId int) (*int, error)
	LessonCaseSort(tx *sqlx.Tx, lessons map[int]int, subjectId int) error
	CurriculumGroupCaseListContentCreator(curriculumGroupId int) ([]userConstant.UserEntity, error)
	SubjectCaseGetCurriculumGroupId(subjectId int) (*int, error)
	LessonCaseCheckDuplicateIndex(tx *sqlx.Tx, subjectId, index int) (*bool, error)
	LessonCreate(tx *sqlx.Tx, lesson *constant.LessonEntity) (*constant.LessonEntity, error)
	LessonUpdate(tx *sqlx.Tx, lesson *constant.LessonEntity) (*constant.LessonEntity, error)

	LessonMonsterGet(lessonID int, levelType string, pagination *helper.Pagination) ([]constant.LessonMonsterImageEntity, error)
	LessonMonsterGetCount(lessonID int, levelType string) (int, error)
	LessonMonsterCreate(lessonID int, monsters []constant.MonsterCreateItem) error
	LessonMonsterDeleteByIDs(monsterIDs []int) error

	SubjectLessonListNoDetails(pagination *helper.Pagination, subjectId int, filter constant.LessonListFilter) (*[]constant.SubjectLessonResponse, error)

	LessonPrefill(tx *sqlx.Tx, subjectId, lessonId int, isExtra bool) error
	LessonCaseGetMeta(lessonIds []int) ([]constant.LessonMetaEntity, error)
	SubjectCaseGetMeta(subjectId int) (*constant.SubjectMetaEntity, error)
	LessonCaseGetSubLesson(subjectId int) ([]constant.SubjectMetaLessonEntity, error)
}
