package g01D04AdminSchoolV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, adminSchoolService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: adminSchoolService}

	app.Patch(path+"/users/:userId", authMiddleware.CheckRoles(constant.Admin), api.UserUpdate)
	app.Get(path+"/users/:userId", authMiddleware.CheckRoles(constant.Admin), api.UserGet)
	app.Post(path+"/users/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.UserCaseBulkEdit)
	app.Patch(path+"/users/:userId/oauth", authMiddleware.CheckRoles(constant.Admin), api.UserCaseDeleteOauth)

	app.Get(path+"/announcers", authMiddleware.CheckRoles(constant.Admin), api.AnnouncerList)
	app.Post(path+"/announcers", authMiddleware.CheckRoles(constant.ContentCreator), api.AnnouncerCreate)
	app.Get(path+"/schools/:schoolId/announcers/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.AnnouncerCaseDownloadCsv)
	app.Post(path+"/schools/:schoolId/announcers/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.AnnouncerCaseUploadCsv)

	app.Patch(path+"/auth/email-password", authMiddleware.CheckRoles(constant.Admin), api.AuthEmailPasswordUpdate)
	app.Patch(path+"/auth/pin", authMiddleware.CheckRoles(constant.Admin), api.AuthPinUpdate)

	app.Post(path+"/observers", authMiddleware.CheckRoles(constant.Admin), api.ObserverCreate)
	app.Get(path+"/observers", authMiddleware.CheckRoles(constant.Admin), api.ObserverList)
	app.Get(path+"/observers/:userId", authMiddleware.CheckRoles(constant.Admin), api.ObserverGet)
	app.Get(path+"/schools/:schoolId/observers/download/csv", authMiddleware.CheckRoles(constant.Admin), api.ObserverCaseDownloadCsv)
	app.Post(path+"/schools/:schoolId/observers/upload/csv", authMiddleware.CheckRoles(constant.Admin), api.ObserverCaseUploadCsv)

	app.Post(path+"/students", authMiddleware.CheckRoles(constant.Admin), api.StudentCreate)
	app.Get(path+"/students/:userId", authMiddleware.CheckRoles(constant.Admin), api.StudentGet)
	app.Patch(path+"/students/:userId", authMiddleware.CheckRoles(constant.Admin), api.StudentUpdate)
	app.Get(path+"/schools/:schoolId/students", authMiddleware.CheckRoles(constant.Admin), api.StudentList)
	app.Get(path+"/students/:userId/classes", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseListClasses)
	app.Get(path+"/students/:userId/classes/:classId/lesson-play-log", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseListLessonPlayLog)
	app.Get(path+"/students/:userId/family", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseGetFamily)
	app.Get(path+"/students/:userId/academic-years", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseListAcademicYear)
	app.Get(path+"/students/:userId/curriculum-groups", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseListCurriculumGroup)
	app.Get(path+"/students/:userId/subjects", authMiddleware.CheckRoles(constant.Admin, constant.Teacher), api.StudentCaseListSubject)
	app.Get(path+"/students/:userId/lessons", authMiddleware.CheckRoles(constant.Admin, constant.Teacher), api.StudentCaseListLesson)
	app.Get(path+"/students/:userId/sub-lessons", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseListSubLesson)
	app.Get(path+"/students/:userId/teacher-notes", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseListTeacherNote)
	app.Get(path+"/schools/:schoolId/students/download/csv", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseDownloadCsv)
	app.Post(path+"/schools/:schoolId/students/upload/csv", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseUploadCsv)
	app.Get(path+"/students/:userId/classes/:classId/lesson-play-log/download/csv", authMiddleware.CheckRoles(constant.Admin), api.StudentCaseLessonPlayLogDownloadCsv)

	app.Post(path+"/teachers", authMiddleware.CheckRoles(constant.Admin), api.TeacherCreate)
	app.Get(path+"/teachers/:teacherId", authMiddleware.CheckRoles(constant.Admin), api.TeacherGet)
	app.Get(path+"/teachers", authMiddleware.CheckRoles(constant.Admin, constant.Teacher), api.TeacherList)
	app.Patch(path+"/teachers/:userId/teacher-accesses", authMiddleware.CheckRoles(constant.Admin), api.TeacherCaseUpdateTeacherAccesses)
	app.Get(path+"/teacher-accesses", authMiddleware.CheckRoles(constant.Admin), api.TeacherAccessList)
	app.Get(path+"/teachers/:teacherId/teaching-log", authMiddleware.CheckRoles(constant.Admin), api.TeacherCaseListTeachingLog)
	app.Get(path+"/teachers/:teacherId/class-log", authMiddleware.CheckRoles(constant.Admin), api.TeacherCaseListClassLog)
	app.Get(path+"/schools/:schoolId/teachers/download/csv", authMiddleware.CheckRoles(constant.Admin), api.TeacherCaseDownloadCsv)
	app.Post(path+"/schools/:schoolId/teachers/upload/csv", authMiddleware.CheckRoles(constant.Admin), api.TeacherCaseUploadCsv)

	app.Post(path+"/auth/login/admin-login-as", authMiddleware.CheckRoles(constant.Admin), api.AuthCaseAdminLoginAs)

	app.Get(path+"/schools/:schoolId", authMiddleware.CheckRoles(constant.Admin, constant.Teacher), api.GetSchool)
	app.Post(path+"/schools", authMiddleware.CheckRoles(constant.Admin), api.SchoolCreate)
	app.Patch(path+"/schools/:schoolId", authMiddleware.CheckRoles(constant.Admin), api.SchoolUpdate)
	app.Get(path+"/schools", authMiddleware.CheckRoles(constant.Admin), api.SchoolList)

	app.Get(path+"/schools/:schoolId/contracts", authMiddleware.CheckRoles(constant.Admin), api.SchoolContractsList)

	app.Get(path+"/school-affiliations", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationList)
	app.Get(path+"/school-affiliations/:schoolAffiliationId", authMiddleware.CheckRoles(constant.Admin), api.GetSchoolAffiliation)
	app.Get(path+"/schools/:schoolId/subjects", authMiddleware.CheckRoles(constant.Admin, constant.Teacher), api.SubjectList)
	app.Patch(path+"/schools/:schoolId/subjects/:subjectId", authMiddleware.CheckRoles(constant.Admin), api.UpdateSubjectStatus)
	app.Post(path+"/schools/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.SchoolBulkEdit)
	app.Post(path+"/schools/:schoolId/subjects/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.SubjectBulkEdit)
	////CSV////
	app.Get(path+"/schools/download/csv", authMiddleware.CheckRoles(constant.Admin), api.SchoolDownloadCSV)
	app.Post(path+"/schools/upload/csv", authMiddleware.CheckRoles(constant.Admin), api.SchoolCsvUpload)

	app.Get(path+"/school-affiliation/types", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffilitaionType)
	app.Get(path+"/school/provinces", authMiddleware.CheckRoles(constant.Admin), api.ProvinceList)
	app.Get(path+"/school-affiliation/doe", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationDoeList)

	app.Get(path+"/schools/:schoolId/contracts/:contractId/subject-group", authMiddleware.CheckRoles(constant.Admin), api.ContractSubjectGroup)
	app.Get(path+"/seed-years", authMiddleware.CheckRoles(constant.Admin, constant.Teacher), api.SeedYearList)
}
