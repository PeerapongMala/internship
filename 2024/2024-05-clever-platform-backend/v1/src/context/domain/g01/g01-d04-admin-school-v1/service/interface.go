package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	UserGet(in *UserGetInput) (*UserGetOutput, error)
	UserUpdate(in *UserUpdateInput) (*UserUpdateOutput, error)
	UserCaseBulkEdit(in *UserCaseBulkEditInput) error
	UserCaseDeleteOauth(in *UserCaseDeleteOauthInput) error

	AnnouncerCreate(in *AnnouncerCreateInput) (*AnnouncerCreateOutput, error)
	AnnouncerList(in *AnnouncerListInput) (*AnnouncerListOutput, error)
	AnnouncerCaseDownloadCsv(in *AnnouncerCaseDownloadCsvInput) (*AnnouncerCaseDownloadCsvOutput, error)
	AnnouncerCaseUploadCsv(in *AnnouncerCaseUploadCsvInput) error

	AuthEmailPasswordUpdate(in *AuthEmailPasswordUpdateInput) error
	AuthPinUpdate(in *AuthPinUpdateInput) error

	ObserverCreate(in *ObserverCreateInput) (*ObserverCreateOutput, error)
	ObserverGet(in *ObserverGetInput) (*ObserverGetOutput, error)
	ObserverList(in *ObserverListInput) (*ObserverListOutput, error)
	ObserverCaseDownloadCsv(in *ObserverCaseDownloadCsvInput) (*ObserverCaseDownloadCsvOutput, error)
	ObserverCaseUploadCsv(in *ObserverCaseUploadCsvInput) error

	StudentCreate(in *StudentCreateInput) (*StudentCreateOutput, error)
	StudentGet(in *StudentGetInput) (*StudentGetOutput, error)
	StudentUpdate(in *StudentUpdateInput) (*StudentUpdateOutput, error)
	StudentList(in *StudentListInput) (*StudentListOutput, error)
	StudentCaseListClasses(in *StudentCaseListClassesInput) (*StudentCaseListClassesOutput, error)
	StudentCaseListLessonPlayLog(in *StudentCaseListLessonPlayLogInput) (*StudentCaseListLessonPlayLogOutput, error)
	StudentCaseListAcademicYear(in *StudentCaseListAcademicYearInput) (*StudentCaseListAcademicYearOutput, error)
	StudentCaseListCurriculumGroup(in *StudentCaseListCurriculumGroupInput) (*StudentCaseListCurriculumGroupOutput, error)
	StudentCaseListSubject(in *StudentCaseListSubjectInput) (*StudentCaseListSubjectOutput, error)
	StudentCaseListLesson(in *StudentCaseListLessonInput) (*StudentCaseListLessonOutput, error)
	StudentCaseListSubLesson(in *StudentCaseListSubLessonInput) (*StudentCaseListSubLessonOutput, error)
	StudentCaseListTeacherNote(in *StudentCaseListTeacherNoteInput) (*StudentCaseListTeacherNoteOutput, error)
	StudentCaseDownloadCsv(in *StudentCaseDownloadCsvInput) (*StudentCaseDownloadCsvOutput, error)
	StudentCaseUploadCsv(in *StudentCaseUploadCsvInput) error
	StudentCaseLessonPlayLogDownloadCsv(in *StudentCaseLessonPlayLogDownloadCsvInput) (*StudentCaseLessonPlayLogDownloadCsvOutput, error)

	TeacherCreate(in *TeacherCreateInput) (*TeacherCreateOutput, error)
	TeacherGet(in *TeacherGetInput) (*TeacherGetOutput, error)
	TeacherList(in *TeacherListInput) (*TeacherListOutput, error)
	TeacherCaseUpdateTeacherAccesses(in *TeacherCaseUpdateTeacherAccessesInput) (*TeacherCaseUpdateTeacherAccessesOutput, error)
	TeacherAccessList(in *TeacherAccessListInput) (*TeacherAccessListOutput, error)
	TeacherCaseListTeachingLog(in *TeacherCaseListTeachingLogInput) (*TeacherCaseListTeachingLogOutput, error)
	TeacherCaseListClassLog(in *TeacherCaseListClassLogInput) (*TeacherCaseListClassLogOutput, error)
	TeacherCaseDownloadCsv(in *TeacherCaseDownloadCsvInput) (*TeacherCaseDownloadCsvOutput, error)
	TeacherCaseUploadCsv(in *TeacherCaseUploadCsvInput) error

	AuthCaseAdminLoginAs(in *AuthCaseAdminLoginAsInput) (*AuthCaseAdminLoginAsOutput, error)

	StudentCaseGetFamily(in *StudentCaseGetFamilyInput) (*StudentCaseGetFamilyOutput, error)
	GetSchoolById(SchoolId int) (constant.SchoolResponse, error)
	SchoolCreate(c *SchoolCreateRequest) error
	SchoolUpdate(c *SchoolUpdateRequest) error
	SchoolBulkEdit(req []constant.SchoolBulkEdit, SubjectId string) error
	SchoolList(filter constant.SchoolListFilter, pagination *helper.Pagination) ([]constant.SchoolListResponse, error)
	SubjectList(SchoolId int, filter constant.FilterSubject, pagination *helper.Pagination) ([]constant.SubjectResponse, int, error)
	UpdateSubjectStatus(req constant.UpdatedSubjectRequest) error
	SubjectBulkEdit(SchoolId int, req []constant.SubjectBulkEdit) error
	GetSchoolContracts(SchoolId int, filter constant.FilterSchoolContract, pagination *helper.Pagination) ([]constant.SchoolContractsResponse, int, error)

	SchoolAffiliationList(filter constant.SchoolAffiliationFilter, pagination *helper.Pagination) ([]constant.SchoolAffiliationList, int, error)
	GetSchoolAffiliation(SchoolAffiliationId int) (constant.SchoolAffilation, error)
	SeedYearList(in *SeedYearListInput) (*SeedYearListOutput, error)

	/////CSV/////
	SchoolCsvDowload(req constant.CsvDowloadRequest) ([]byte, error)
	SchoolCsvUpload(req constant.CSVUploadRequest) error

	ProvinceList(pagination *helper.Pagination) ([]constant.ProvinceList, int, error)
	SchoolAffiliationDoeList(pagination *helper.Pagination) ([]constant.SchoolAffiliationDoeList, int, error)
	ContractSubjectGroup(pagination *helper.Pagination, contractId int, filter constant.FilterSubject) ([]constant.ContractsSubjectGroup, int, error)
}
