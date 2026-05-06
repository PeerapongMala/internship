package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"

type ServiceInterface interface {
	OptionListGetByParams(in constant.OptionFilter) (*constant.OptionObject, error)
	LessonStatListGetByParams(in constant.LessonStatFilter) ([]constant.LessonStat, error)
	LessonStatCsvGetByParams(in constant.LessonStatFilter) ([]byte, error)
	SubLessonStatListGetByParams(in constant.SubLessonStatFilter) ([]constant.SubLessonStat, error)
	SubLessonStatCsvGetByParams(in constant.SubLessonStatFilter) ([]byte, error)
	LevelStatListGetByParams(in constant.LevelStatFilter) ([]constant.LevelStat, error)
	LevelStatCsvGetByParams(in constant.LevelStatFilter) ([]byte, error)
	PlayLogStatListGetByParams(in constant.PlayLogStatFilter) ([]constant.PlayLogStat, error)
	PlayLogStatCsvGetByParams(in constant.PlayLogStatFilter) ([]byte, error)
	StudyGroupLists(filter constant.StudyGroupListFilter) ([]constant.StudyGroupList, error)
}
