package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	LearningLessonList(pagination *helper.Pagination, subjectId int, userId string) (*[]constant.LearningLessonList, error)
	LearningLessonGet(lessonId int) (*constant.LearningLessonEntity, error)

	LearningSublessonList(pagination *helper.Pagination, lessonId int, userId string) (*[]constant.LearningSublessonList, error)
	LearningSubessonGet(sublessonId int) (*constant.LearningSublessonDataEntity, error)
}
