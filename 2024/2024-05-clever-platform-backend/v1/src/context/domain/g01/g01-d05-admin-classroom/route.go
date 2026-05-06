package g02d01SchoolAffiliationV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, classroomService service.ServiceInterface, path string) {
	api := &service.APiStruct{Service: classroomService}
	group := app.Group(path)

	group.Post("/classrooms", authMiddleware.CheckRoles(constant.Admin), api.ClassroomCreate)
	group.Patch("/classrooms/:classRoomId", authMiddleware.CheckRoles(constant.Admin), api.ClassroomUpdate)
	group.Get("/classrooms/:classRoomId", authMiddleware.CheckRoles(constant.Admin), api.ClassroomGet)
	group.Get("/schools/:schoolId/classrooms", authMiddleware.CheckRoles(constant.Admin), api.ClassroomList)
	group.Post("/classrooms/:classRoomId/clone", authMiddleware.CheckRoles(constant.Admin), api.ClassroomClone)
	group.Patch("/schools/:schoolId/classrooms/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.ClassroomBulkUpdate)
	group.Get("/schools/:schoolId/classrooms/download/csv", authMiddleware.CheckRoles(constant.Admin), api.ClassroomDownloadCSV)
	group.Post("/schools/:schoolId/classrooms/upload/csv", authMiddleware.CheckRoles(constant.Admin), api.ClassroomUploadCSV)
	group.Get("/schools/:schoolId/classrooms/academic-year", authMiddleware.CheckRoles(constant.Admin), api.ClassroomAcademicYearGet)
	group.Get("/schools/:schoolId/classrooms/year", authMiddleware.CheckRoles(constant.Admin), api.ClassroomYearGet)

	group.Get("/schools/:schoolId/teachers", authMiddleware.CheckRoles(constant.Admin), api.TeacherSchoolList)
	group.Post("/classrooms/:classRoomId/teachers", authMiddleware.CheckRoles(constant.Admin), api.TeacherCreate)
	group.Patch("/classrooms/:classRoomId/teachers/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.TeacherBulkUpdate)
	group.Get("/classrooms/:classRoomId/teachers", authMiddleware.CheckRoles(constant.Admin), api.TeacherClassroomList)
	group.Get("/classrooms/:classRoomId/teachers/download/csv", authMiddleware.CheckRoles(constant.Admin), api.TeacherDownloadCSV)
	group.Delete("/classrooms/:classRoomId/teachers/:teacherId", authMiddleware.CheckRoles(constant.Admin), api.TeacherDelete)

	group.Get("/schools/:schoolId/students", authMiddleware.CheckRoles(constant.Admin), api.StudentSchoolList)
	group.Patch("/classrooms/:classRoomId/students/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.StudentBulkUpdate)
	group.Post("/classrooms/:classRoomId/students", authMiddleware.CheckRoles(constant.Admin), api.StudentCreate)
	group.Get("/classrooms/:classRoomId/students", authMiddleware.CheckRoles(constant.Admin), api.StudentClassroomList)
	group.Get("/classrooms/:classRoomId/students/download/csv", authMiddleware.CheckRoles(constant.Admin), api.StudentDownloadCSV)
	group.Delete("/classrooms/:classRoomId/students/:studentId", authMiddleware.CheckRoles(constant.Admin), api.StudentDelete)
	group.Post("/classrooms/:classRoomId/students/:studentId", authMiddleware.CheckRoles(constant.Admin), api.StudentMove)
	group.Post("/schools/:schoolId/move-student", authMiddleware.CheckRoles(constant.Admin), api.ClassroomCaseMoveStudentCsv)
}
