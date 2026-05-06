package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	AnnouncementList(userID string, pagination *helper.Pagination) ([]*constant.AnnouncementList, error)
	AnnouncementGet(announcementID int) (*constant.Announcement, error)

	// Homework
	HomeworkList(req *HomeworkRequest, pagination *helper.Pagination) ([]*constant.Homework, error)
	GetStudentInFamily(userID string, pagination *helper.Pagination) ([]*constant.StudentInFamily, error)
	OverViewHomeworkStatus(req *HomeworkRequest) ([]*constant.OverViewStatus, error)
	GetStudentInfo(userID string) (*constant.Student, error)

	//Family
	AddMember(familyID int, userID string) error
	MemberInFamily(userID string) (*constant.FamilyMembers, error)
	ManageFamily(bug *constant.Family) error
	CheckMemberNotExist(userID string) (*bool, error)

	// Report Bug
	CreateReportBug(bug *constant.Bug) error
	GetReportBug(bugID int) (*constant.Bug, error)
	ListReportBug(string, *helper.Pagination) ([]*constant.BugList, error)

	// Dashboard
	SubjectList(in *constant.OverViewStatusFilter, pagination *helper.Pagination) ([]*constant.Subject, error)
	LessonList(userID string, subjectID int, pagination *helper.Pagination) ([]*constant.Lesson, error)
	GetOverviewStats(in *constant.OverViewStatusFilter) (*overviewStats, error)
	LessonProgress(in *constant.OverViewStatusFilter, pagination *helper.Pagination) ([]*constant.LessonScore, error)
	SubLessonProgress(in *constant.OverViewStatusFilter, pagination *helper.Pagination) ([]*constant.SubLessonScore, error)

	GetSchoolDetailsByClassId(in *GetSchoolDetailsByClassIdInput) (*GetSchoolDetailsByClassIdOutput, error)
}
