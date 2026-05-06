package storagerepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	// Announcement
	AnnouncementList(userID string, pagination *helper.Pagination) ([]*constant.AnnouncementList, error)
	AnnouncementGet(announcementID int) (*constant.Announcement, error)

	// Homework
	HomeworkList(userID string, classID int, pagination *helper.Pagination) ([]*constant.Homework, error)
	GetStudentInFamily(userID string, pagination *helper.Pagination) ([]*constant.StudentInFamily, error)
	GetHomeworkStatus(homeworkID int, userID string, classID int) (*constant.HomeworkPlayCount, error)
	GetStudentInfo(userID string) (*constant.Student, error)

	// Family
	AddMember(familyID int, userID string) error
	MemberInFamily(userID string) (*constant.FamilyMembers, error)
	DeleteFamily(tx *sqlx.Tx, familyID int) error
	CheckOwner(userID string) (*bool, error)
	CheckMemberNotExist(userID string) (*bool, error)

	// Report Bug
	CreateReportBug(tx *sqlx.Tx, bug *constant.Bug) (*int, error)
	ReportBugImageCreate(tx *sqlx.Tx, bugId int, imageUrls []string) error
	GetReportBug(bugID int) (*constant.Bug, error)
	ListReportBug(string, *helper.Pagination) ([]*constant.BugList, error)

	// Dashboard
	SubjectList(in *constant.OverViewStatusFilter, pagination *helper.Pagination) ([]*constant.Subject, error)
	LessonList(userID string, subjectID int, pagination *helper.Pagination) ([]*constant.Lesson, error)
	GetLevelTotalByStudentAndSubject(in *constant.OverViewStatusFilter) ([]*constant.PlayLogData, error)
	GetLevelPlayLogAttemtCount(in *constant.OverViewStatusFilter) (int, error)
	TotalScoreOfLessonByDate(in *constant.OverViewStatusFilter, date string, pagination *helper.Pagination) ([]*constant.LessonScore, error)
	TotalScoreOfSubLessonByDate(in *constant.OverViewStatusFilter, date string, pagination *helper.Pagination) ([]*constant.SubLessonScore, error)

	GetSchoolDetailsByClassId(classId int) (*constant.SchoolDetails, error)
}
