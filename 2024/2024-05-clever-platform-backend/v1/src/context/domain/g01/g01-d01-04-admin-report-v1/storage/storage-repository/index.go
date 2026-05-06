package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/lib/pq"
)

type Repository interface {
	SchoolReportList(schoolIds pq.Int64Array, pagination *helper.Pagination, filter *constant.SchoolReportFilter, canAccessAll bool) ([]constant.SchoolReportEntity, error)
	ClassReportList(pagination *helper.Pagination, filter *constant.ClassReportFilter) ([]constant.ClassReportEntity, error)
	StudentReportList(pagination *helper.Pagination, filter *constant.StudentReportFilter) ([]constant.StudentReportEntity, error)
	LessonReportList(pagination *helper.Pagination, filter *constant.LessonReportFilter) ([]constant.LessonReportEntity, error)
	SubLessonReportList(pagination *helper.Pagination, filter *constant.SubLessonReportFilter) ([]constant.SubLessonReportEntity, error)
	LevelReportList(pagination *helper.Pagination, filter *constant.LevelReportFilter) ([]constant.LevelReportEntity, error)
	LevelPlayLogList(pagination *helper.Pagination, filter *constant.LevelPlayLogFilter) ([]constant.LevelPlayLogEntity, error)

	CurriculumGroupList(pagination *helper.Pagination, userId string) ([]constant.CurriculumGroupEntity, error)
	SubjectList(pagination *helper.Pagination, filter *constant.SubjectFilter) ([]constant.SubjectEntity, error)
	LessonList(pagination *helper.Pagination, filter *constant.LessonFilter) ([]constant.LessonEntity, error)
	SubLessonList(pagination *helper.Pagination, filter *constant.SubLessonFilter) ([]constant.SubLessonEntity, error)
	StudentAcademicYearList(pagination *helper.Pagination, userId string) ([]int, error)

	ClassLessonIdList(classId int) (levelIds []int, err error)
}
