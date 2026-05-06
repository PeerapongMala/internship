package g03D05TeacherLessonV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, teacherLessonService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: teacherLessonService}

	app.Get(path+"/classes/:classId/lessons", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.ClassLessonList)
	app.Post(path+"/classes/:classId/lessons/:lessonId", authMiddleware.CheckRoles(constant.Teacher), api.ClassLessonCaseToggle)
	app.Post(path+"/classes/:classId/subLessons/:subLessonId/level-lock", authMiddleware.CheckRoles(constant.Teacher), api.LessonLevelLockToggle)
	app.Get(path+"/classes/:classId/curriculum-groups", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.ClassLessonCaseListCurriculumGroup)
	app.Get(path+"/classes/:classId/subjects", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.TeacherCaseListSubject)
	app.Get(path+"/classes/:classId/sub-lessons", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.ClassSubLessonList)
	app.Post(path+"/classes/:classId/sub-lessons/:subLessonId", authMiddleware.CheckRoles(constant.Teacher), api.ClassSubLessonCaseToggle)
	app.Get(path+"/classes/:classId/sub-lessons/:subLessonId/levels", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.LevelList)
	app.Get(path+"/classes/:classId/levels/:levelId/unlocked-study-groups", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.LevelCaseListUnlockedStudyGroup)
	app.Get(path+"/classes/:classId/levels/:levelId/unlocked-students", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.LevelCaseListUnlockedStudent)
	app.Post(path+"/levels/:levelId/study-groups", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.LevelUnlockedForStudyGroupCreate)
	app.Post(path+"/levels/:levelId/students", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.LevelUnlockedForStudentCreate)
	app.Get(path+"/classes/:classId/students", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.StudentList)
	app.Get(path+"/classes/:classId/subjects/:subjectId/study-groups", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.StudyGroupList)
	app.Post(path+"/levels/:levelId/study-groups/bulk-edit", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.UnlockedStudyGroupCaseBulkEdit)
	app.Post(path+"/classes/:classId/levels/:levelId/students/bulk-edit", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.UnlockedStudentCaseBulkEdit)
	app.Get(path+"/classes", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.ClassList)
	app.Get(path+"/seed-academic-years", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.SeedAcademicYearList)

	app.Post(path+"/classes/:classId/lessons/:lessonId/unlocked-study-groups", authMiddleware.CheckRoles(constant.Teacher), api.LessonUnlockedForStudyGroupCreate)
	app.Get(path+"/classes/:classId/lessons/:lessonId/unlocked-study-groups", authMiddleware.CheckRoles(constant.Teacher), api.LessonCaseListUnlockedStudyGroup)
	app.Post(path+"/classes/:classId/lessons/:lessonId/unlocked-study-groups/bulk-edit", authMiddleware.CheckRoles(constant.Teacher), api.LessonUnlockedStudyGroupCaseBulkEdit)

	app.Post(path+"/lessons/:lessonId/unlocked-students", authMiddleware.CheckRoles(constant.Teacher), api.LessonUnlockedForStudentCreate)
	app.Get(path+"/classes/:classId/lessons/:lessonId/unlocked-students", authMiddleware.CheckRoles(constant.Teacher), api.LessonCaseListUnlockedStudent)
	app.Post(path+"/classes/:classId/lessons/:lessonId/unlocked-students/bulk-edit", authMiddleware.CheckRoles(constant.Teacher), api.LessonUnlockedStudentCaseBulkEdit)
}
