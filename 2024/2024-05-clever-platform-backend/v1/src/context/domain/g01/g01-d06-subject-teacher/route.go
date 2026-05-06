package g01d06SubjectTeacherV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, subjectTeacherService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: subjectTeacherService}

	app.Get(path+"/:schoolId/subjects", authMiddleware.CheckRoles(constant.Admin), api.SchoolSubjectList)
	app.Get(path+"/:schoolId/subjects/:subjectId/teachers", authMiddleware.CheckRoles(constant.Admin), api.SubjectTeacherList)
	app.Get(path+"/seed-academic-years", authMiddleware.CheckRoles(constant.Admin), api.SeedAcademicYearList)
	app.Post(path+"/subjects/:subjectId/teachers/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.SubjectTeacherCaseBulkEdit)
	app.Post(path+"/subjects/:subjectId/teachers", authMiddleware.CheckRoles(constant.Admin), api.SubjectTeacherCreate)
	app.Get(path+"/:schoolId/teachers", authMiddleware.CheckRoles(constant.Admin), api.SchoolTeacherList)
	app.Get(path+"/subjects/:subjectId", authMiddleware.CheckRoles(constant.Admin), api.SubjectGet)
}
