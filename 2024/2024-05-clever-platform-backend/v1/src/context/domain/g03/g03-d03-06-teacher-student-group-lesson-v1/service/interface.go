package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"

type ServiceInterface interface {
	GetLessonLevelStatList(teacherId string, in *constant.GetLessonLevelStatListAndCsvParams) (constant.GetLessonLevelStatListResult, error)
	GetLessonLevelStatCsv(teacherId string, in *constant.GetLessonLevelStatListAndCsvParams) (constant.GetLessonLevelStatCsvResult, error)
	GetLessonParams(studyGroupId int) ([]constant.LessonParamsEntity, error)
	GetSubLessonParams(in *constant.GetSubLessonParamsParams) ([]constant.SubLessonParamsEntity, error)
}
