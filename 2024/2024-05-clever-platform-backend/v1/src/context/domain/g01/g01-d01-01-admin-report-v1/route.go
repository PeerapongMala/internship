package g01D0101AdminReportV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, observerMiddleware *middleware.ObserverMiddleware, adminReportService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: adminReportService}

	app.Get(path+"/dasboard/progress/schools", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.SchoolList)
	app.Get(path+"/dasboard/progress/school/:schoolId/teachers", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.AdminProgressGetSchoolTeachers)
	app.Get(path+"/dasboard/progress/school/:schoolId/teachers/:teacherId", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.AdminProgressGetSchoolTeacherClassroom)
	app.Get(path+"/dasboard/progress/school/:schoolId/classes", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.AdminProgressGetSchoolClasses)

	app.Get(path+"/best-students", authMiddleware.CheckRoles(constant.Admin), api.BestStudentList)
	app.Get(path+"/best-teachers/class-stars", authMiddleware.CheckRoles(constant.Admin), api.BestTeacherListByClassStars)
	app.Get(path+"/best-teachers/study-group-stars", authMiddleware.CheckRoles(constant.Admin), api.BestTeacherListByStudyGroupStars)
	app.Get(path+"/best-teachers/homework", authMiddleware.CheckRoles(constant.Admin), api.BestTeacherListByHomework)
	app.Get(path+"/best-teachers/lesson", authMiddleware.CheckRoles(constant.Admin), api.BestTeacherListByLesson)
	app.Get(path+"/best-schools/avg-class-stars", authMiddleware.CheckRoles(constant.Admin), api.BestSchoolListByAvgClassStars)
}
