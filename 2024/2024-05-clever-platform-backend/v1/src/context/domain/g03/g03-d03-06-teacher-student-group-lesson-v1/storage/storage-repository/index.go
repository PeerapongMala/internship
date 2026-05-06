package storagerepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"
)

type Repository interface {
	GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId int, teacherId string) ([]string, error)
	GetLessonLevelStatListByParams(in *constant.GetLessonLevelStatListAndCsvParams) ([]constant.LessonLevelStatEntity, error)
	GetLessonByStudyGroupId(studyGroupID int) ([]constant.LessonParamsEntity, error)
	GetSubLessonByLessonId(lessonId int) ([]constant.SubLessonParamsEntity, error)
}
