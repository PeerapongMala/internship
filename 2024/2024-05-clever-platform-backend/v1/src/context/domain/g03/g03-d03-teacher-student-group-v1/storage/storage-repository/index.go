package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
)

type Repository interface {
	StudyGroupList(filter constant.StudyGroupListFilter) ([]constant.StudyGroupList, error)

	// Shared
	// PlayStatListGetByParams(studyGroupId int, dateRange helper.DateFilterBase) ([]constant.StatEntity, error)
	StudentIdListGetByStudyGroupId(studyGroupId int, teacherId string) ([]string, error)

	//LessonStat
	LessonStatListGetByParams(in constant.LessonStatFilter) ([]constant.LessonStatEntity, error)
	SubLessonStatListGetByParams(in constant.SubLessonStatFilter) ([]constant.SubLessonStatEntity, error)
	LevelStatListGetByParams(in constant.LevelStatFilter) ([]constant.LevelStatEntity, error)

	//Options
	AcademicYearOptionListGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	SubjectOptionListGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	LessonOptionListGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	SubLessonOptionListGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)

	//PlayStat
	PlayLogStatListGetByParams(in constant.PlayLogStatFilter) ([]constant.PlayLogStatEntity, error)
}
