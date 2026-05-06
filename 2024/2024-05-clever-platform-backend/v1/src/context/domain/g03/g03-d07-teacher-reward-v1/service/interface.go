package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	TeacherRewardCreate(in *TeacherRewardCreateInput) error
	TeacherRewardList(teacherId string, filter constant.TeacherRewardListFilter, pagination *helper.Pagination) ([]constant.TeacherRewardList, error)
	TeacherRewardCallBack(req constant.CallbackUpdate) error
	TeacherRewardBulkEdit(req []constant.TeacherRewardBulkEdit, subjectId string, Roles []int) error
	TeacherRewardCsvDownload(req constant.CsvDowloadRequest, filter constant.TeacherRewardListFilter, Role constant.CheckRoleRequest, pagination *helper.Pagination) ([]byte, error)
	TeacherRewardCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error
	TeacherSubjectList(teacherId string, pagination *helper.Pagination) ([]constant.TeacherSubject, error)
	StundentListBySchoolId(teacherId string, filter constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentResponse, error)
	AcademicYearList(teacherId string, pagination *helper.Pagination) ([]constant.AcademicYear, error)
	YearList(teacherId string, pagination *helper.Pagination) ([]constant.Year, error)
	ClassList(teacherId string, year string, academicYear int, pagination *helper.Pagination) ([]constant.Class, error)
	StudyGroupList(teacherId string, classId int, pagination *helper.Pagination) ([]constant.StudyGroup, error)
	StudentGet(studentId string, teacherId string) (*constant.StudentGet, error)
	TeacherItem(teacherId string, subjectId int, pagination *helper.Pagination) ([]constant.ItemReponse, error)
	ItemGet(itemId int) (*constant.ItemInfo, error)
	CouponTransactionList(in *CouponTransactionListInput) (*CouponTransactionListOutput, error)
	CouponTransactionUpdate(in *CouponTransactionUpdateInput) error
	TeacherRewardCaseCopy(in *TeacherRewardCaseCopyInput) (*TeacherRewardCaseCopyOutput, error)
}
