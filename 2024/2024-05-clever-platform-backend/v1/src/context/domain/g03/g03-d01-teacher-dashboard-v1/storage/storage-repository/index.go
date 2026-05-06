package storagerepository

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	GetTeacherSchoolId(teacherId string) (*int, error)
	GetTeacherClassIds(schoolId int, teacherId string, filter *constant.ClassFilter) ([]int, error)
	GetClasses(classIds []int, filter *constant.ClassFilter, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	GetStudentCount(classIds []int) (int, error)
	GetTotalStudentCountByStudyGroupIds(studyGroupIds []int) (int, error)
	GetHomeworks(filter *constant.HomeworkFilter) ([]constant.HomeworkEntity, error)
	GetLevelsFromHomeworkTemplateIds(homeworkTemplateIds []int) ([]constant.HomeworkLevels, error)
	GetLevelPlayLogs(filter *constant.LevelPlayLogFilter) ([]constant.LevelPlayLogEntity, error)
	GetLevelsFromClassIds(classIds []int) ([]constant.LevelEntity, error)
	GetQuestionsFromLevelIds(levelIds []int) ([]constant.QuestionEntity, error)
	GetQuestionPlayLogsFromLevelPlayLogIds(levelPlayLogIds []int) ([]constant.QuestionPlayLogEntity, error)
	GetSubjectFromClassIds(classIds []int, pagination *helper.Pagination) ([]constant.SubjectEntity, error)
	GetLessonFromSubjectIds(subjectIds []int, pagination *helper.Pagination) ([]constant.LessonEntity, error)
	GetStudentScores(classIds []int, studyGroupIds []int, lessonIds []int, pagination *helper.Pagination, sortDirection constant.SortDirection) ([]constant.StudentScoreEntity, error)
	GetSchoolAcademicYears(schoolId int, pagination *helper.Pagination) ([]constant.SchoolAcademicYearEntity, error)

	GetLessonProgressOverview(schoolId int, classIds []int, studyGroupIds []int, subjectIds []int, startAt time.Time, endAt time.Time, pagination *helper.Pagination) ([]constant.ProgressReport, error)
	GetSubLessonProgressOverview(schoolId int, classIds []int, studyGroupIds []int, subjectIds []int, lessonIds []int, startAt time.Time, endAt time.Time, pagination *helper.Pagination) ([]constant.ProgressReport, error)

	GetHomeworksFromLessonIds(lessonIds []int, filter *constant.HomeworkFromLessonIdsFilter, teacherId string) ([]constant.HomeworkEntity, error)
	GetClassStudents(classIds, studyGroupIds []int) ([]constant.ClassStudentEntity, error)
	GetSubLessonsFromLessonIds(lessonIds []int) ([]constant.SubLessonEntity, error)
	GetLevelsFromSubLessonIds(subLessonIds []int) ([]constant.LevelEntity, error)

	GetClassLevels(classId []int, lessonId int, studyGroupIds []int) (levelIds []int, err error)
	GetMaxScoreCount(levelIds []int, studentIds []string) (count int, err error)
	TeacherSubjectList(userId string, pagination *helper.Pagination, year string) ([]constant.Subject, error)
}
