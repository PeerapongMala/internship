package g03D04TeacherStudentV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(
	app *fiber.App, authMiddleware *middleware.AuthMiddleware,
	teacherStudentService service.ServiceTeacherStudentInterface,
	path string,
) {
	api := &service.APIStruct{
		Service: teacherStudentService,
	}

	route := app.Group(path)

	// #=============================== A01 ===============================#

	route.Get("/class/level-stat", authMiddleware.CheckRoles(constant.Teacher), api.ClassStatListGetByTeacherId)
	route.Get("/class/level-stat/download/csv", authMiddleware.CheckRoles(constant.Teacher), api.LessonStatListDownloadCsvGetByTeacherId)
	route.Get("/curriculum-groups", authMiddleware.CheckRoles(constant.Teacher), api.CurriculumGroupListGet)
	route.Get("/:curriculumGroupId/subjects", authMiddleware.CheckRoles(constant.Teacher), api.SubjectListGetByCurriculumGroupId)
	route.Get("/subjects", authMiddleware.CheckRoles(constant.Teacher), api.SubjectListGetByTeacherGroupId)
	route.Get("academic_year/:academic_year/years/:year/subject/:subject_id/classes", authMiddleware.CheckRoles(constant.Teacher), api.ClassListGetByTeacherIDYearAcademicYearSubjectID)
	route.Get("/:subjectId/lessons", authMiddleware.CheckRoles(constant.Teacher), api.LessonListGetBySubjectId)
	route.Get("/:lessonId/sub-lessons", authMiddleware.CheckRoles(constant.Teacher), api.SubLessonListGetByLessonId)

	route.Get("/academic-years", authMiddleware.CheckRoles(constant.Teacher), api.TeacherAcademicYearListGet)
	route.Get("/academic-years/:academicYear/years", authMiddleware.CheckRoles(constant.Teacher), api.TeacherYearListGetByAcademicYear)
	route.Get("/academic_year/:academic_year/years/:year/subjects", authMiddleware.CheckRoles(constant.Teacher), api.SubjectListGetByAcademicYearAndYear)
	route.Get("/academic-years/:academicYear/years/:year/classes", authMiddleware.CheckRoles(constant.Teacher), api.TeacherClassListGetByAcademicYearAndYear)

	// #=============================== A02 ===============================#

	route.Get("/academic-year-ranges", authMiddleware.CheckRoles(constant.Teacher, constant.Admin, constant.Observer), api.AcademicYearRangeList)
	route.Post("/academic-year-ranges", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.AcademicYearRangeCreate)
	route.Delete("/academic-year-ranges/:academicYearRangeId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.AcademicYearRangeDelete)

	route.Post("/academic-year/level-stat", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.LessonStatAcademicYearListGet)
	route.Post("/academic-year/level-stat/download/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.LessonStatAcademicYearCsvGet)

	route.Get("/student/:studentId/level/classes", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelClassListGetByStudentId)

	route.Get("/student/:studentId/level-stat/academicYear/:academicYear", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelStatListGetByStudentIdAndAcademicYear)
	route.Get("/student/:studentId/rewards/academicYear/:academicYear", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentItemListGetByParams)
	route.Get("/student/:studentId/groups/academicYear/:academicYear", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudyGroupListGetByParams)
	route.Get("/student/:studentId/level-stat/academicYear/:academicYear/download/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelStatCsvGetByStudentIdAndAcademicYear)
	route.Get("/student/:studentId/rewards/academicYear/:academicYear/download/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentItemCsvGetByParams)
	route.Get("/student/:studentId/groups/academicYear/:academicYear/download/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudyGroupCsvGetByParams)
	route.Get("/student/:studentId/options/academicYear/:academicYear", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.OptionsGetByStudentIdAndAcademicYear)

	route.Get("/student/:studentId/level-stat/lessonId/:lessonId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelStatListGetByStudentIdAndLessonId)
	route.Get("/student/:studentId/level-stat/lessonId/:lessonId/download/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelStatCsvGetByStudentIdAndLessonId)
	route.Get("/student/:studentId/options/lessonId/:lessonId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.OptionsGetByStudentIdAndALessonId)

	route.Get("/student/:studentId/level-stat/subLesson/:subLessonId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelStatListGetByStudentIdAndSubLessonId)
	route.Get("/student/:studentId/level-stat/subLesson/:subLessonId/download/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelStatCsvGetByStudentIdAndSubLessonId)

	route.Get("/student/:studentId/level-stat/level/:levelId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelStatListGetByStudentIdAndLevelId)
	route.Get("/student/:studentId/level-stat/level/:levelId/download/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentLevelStatCsvGetByStudentIdAndLevelId)

	route.Get("/student/:studentId/comment/options", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.CommentOptionsGetByParams)
	route.Post("/student/comment/new", authMiddleware.CheckRoles(constant.Admin, constant.Teacher), api.TeacherCommentCreate)
	route.Get("/student/:studentId/comments/academicYear/:academicYear", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherCommentListGetByParams)
	route.Patch("/student/comment/:commentId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherCommentUpdate)
	route.Delete("/student/comment/:commentId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherCommentDelete)

	// #=============================== A03 ===============================#

	route.Get("/school", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.SchoolInfoGet)
	route.Get("/students", authMiddleware.CheckRoles(constant.Teacher), api.StudentListByTeacherId)
	route.Get("/students/download/csv", authMiddleware.CheckRoles(constant.Teacher), api.StudentListDownloadByTeacherId)
	route.Get("/students/:studentId", authMiddleware.CheckRoles(constant.Teacher), api.StudentByStudentId)
	route.Patch("/students/:studentId/pin", authMiddleware.CheckRoles(constant.Teacher), api.StudentPinUpdateByStudentId)
	route.Get("/students/:studentId/profile", authMiddleware.CheckRoles(constant.Teacher), api.StudentProfileGetByStudentId)
	route.Get("/students/:studentId/classes", authMiddleware.CheckRoles(constant.Teacher), api.StudentClassListByStudentId)
	route.Get("/students/:studentId/levels/classes", authMiddleware.CheckRoles(constant.Teacher), api.StudentLogLevelPlayClassListByStudentId)
	route.Get("/students/:studentId/family", authMiddleware.CheckRoles(constant.Teacher), api.StudentFamilyMemberByStudentId)

	route.Get("/classes", authMiddleware.CheckRoles(constant.Teacher), api.TeacherClassList)
	route.Get("/years", authMiddleware.CheckRoles(constant.Teacher), api.YearList)
}
