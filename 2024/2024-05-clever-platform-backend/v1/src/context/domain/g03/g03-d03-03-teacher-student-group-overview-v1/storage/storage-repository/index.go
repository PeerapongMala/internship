package storagerepository

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	GetStudyGroup(studyGroupId int) (constant.StudyGroupEntity, error)
	ListLessons(subjectId int, pagination *helper.Pagination) ([]constant.LessonEntity, error)
	ListSubLessons(lessonId int, pagination *helper.Pagination) ([]constant.SubLessonEntity, error)
	GetLevelPlaylogs(studyGroupId int, filter constant.LevelPlayLogFilter) ([]constant.LevelPlayLogEntity, error)
	GetNotParticipateStudents(studyGroupId int, pagination *helper.Pagination, filter *constant.NotParticipateStudentsFilter) ([]constant.StudentLevelPlayLogCountEntity, error)
	GetTopStudentScore(classId int, studyGroupId int, filter constant.TopStudentScoreFilter) ([]constant.StudentScoreEntity, error)
	GetClassStudents(classId int) ([]constant.ClassStudentEntity, error)
	GetLastLoggedInStudents(studyGroupId int, startAt time.Time, endAt time.Time) ([]constant.UserEntity, error)
	CountStudentsInStudyGroup(studyGroupId int) (count int, err error)
	GetClassStudentUsers(classId int) ([]constant.UserEntity, error)
	GetLessonProgressions(classId int, subject int, studyGroupId int, startAt time.Time, endAt time.Time, pagination *helper.Pagination) ([]constant.ProgressReport, error)
	GetSubLessonProgressions(classId int, subject int, lessonId int, studyGroupId int, startAt time.Time, endAt time.Time, pagination *helper.Pagination) ([]constant.ProgressReport, error)
	GetLevelPlayLogsOverviewByStudyGroup(studyGroupId int, filter constant.LevelPlayLogFilter) (entities []constant.LevelPlayLogsOverviewByStudyGroup, err error)
	// ListSubLessons(lessonId int, pagination *helper.Pagination) ()
	// GetTeacherSchoolId(teacherId string) (*int, error)
	// GetTeacherClassIds(schoolId int, teacherId string, filter *constant.ClassFilter) ([]int, error)
	// GetClasses(classIds []int, filter *constant.ClassFilter, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	// GetStudentCount(classIds []int) (int, error)
	// GetHomeworks(filter *constant.HomeworkFilter) ([]constant.HomeworkEntity, error)
	// GetLevelsFromHomeworkTemplateIds(homeworkTemplateIds []int) ([]int, error)
	// GetLevelPlayLogs(filter *constant.LevelPlayLogFilter) ([]constant.LevelPlayLogEntity, error)
	// GetLevelsFromClassIds(classIds []int) ([]constant.LevelEntity, error)
	// GetQuestionsFromLevelIds(levelIds []int) ([]constant.QuestionEntity, error)
	// GetQuestionPlayLogsFromLevelPlayLogIds(levelPlayLogIds []int) ([]constant.QuestionPlayLogEntity, error)
	// GetSubjectFromClassIds(classIds []int, pagination *helper.Pagination) ([]constant.SubjectEntity, error)
	// GetLessonFromSubjectIds(subjectIds []int, pagination *helper.Pagination) ([]constant.LessonEntity, error)
	// GetStudentScores(lessonIds []int, limit int, sortDirection constant.SortDirection) ([]constant.StudentScoreEntity, error)
}
