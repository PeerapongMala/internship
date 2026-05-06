package storagerepository

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	AdminProgressGetSchoolTeacherStatistics(schoolID int, pagination *helper.Pagination, startDate *time.Time, endDate *time.Time) (progressReportEntities []constant.ProgressReport, err error)
	AdminProgressGetSchoolTeacherClassStatistics(teacherID string) (name string, classRoomCount int, homeworkCount int, err error)
	AdminProgressGetSchoolTeacherClassroomStatistics(schoolID int, teacherID string, pagination *helper.Pagination, startDate *time.Time, endDate *time.Time) (progressReportEntities []constant.ProgressReport, err error)
	AdminProgressGetSchoolTeacherClasses(schoolID int, academicYear string, year string, pagination *helper.Pagination, startDate *time.Time, endDate *time.Time) (progressReportEntities []constant.ProgressReport, err error)
	SchoolList(pagination *helper.Pagination, affiliationType string, scope string) ([]constant.SchoolEntity, error)

	BestStudentList(pagination *helper.Pagination, filter *constant.BestStudentListFilter) ([]constant.BestStudentEntity, error)
	BestTeacherListByClassStars(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestTeacherListByClassStars, error)
	BestTeacherListByStudyGroupStars(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestTeacherListByStudyGroupStars, error)
	BestTeacherListByHomework(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestTeacherListByHomework, error)
	BestTeacherListByLesson(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestTeacherListByLesson, error)
	BestSchoolListByAvgClassStars(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestSchoolListByAvgClassStars, error)
}
