package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	ListLearningLesson(pagination *helper.Pagination, subjectId int, userId string, studyGroupId []int) (*[]constant.LearningLessonList, error)
	GetLearningLesson(lessonId int) (*constant.LearningLessonEntity, error)
	StudyGroupGetByUserId(userId string) ([]int, error)

	ListLearningSublesson(pagination *helper.Pagination, lessonId int, userId string) (*[]constant.LearningSublessonList, error)
	GetLearningSublesson(sublessonId int) (*constant.LearningSublessonDataEntity, error)
	LessonCaseGetStat(lessonIds []int, userId string) ([]constant.PlayStatEntity, error)
	SubLessonCaseGetStat(subLessonIds []int, userId string) ([]constant.PlayStatEntity, error)
}
