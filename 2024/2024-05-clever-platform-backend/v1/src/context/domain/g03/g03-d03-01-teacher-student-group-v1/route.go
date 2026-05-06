package G03D0301TeacherStudentGroupV1

import (
	constRole "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := service.NewApiStruct(serviceInstance)
	app.Put(path+"/study-group", authMiddleware.CheckRoles(constRole.Teacher), api.PutStudyGroup)
	app.Get(path+"/study-group/:study_group_id", authMiddleware.CheckRoles(constRole.Teacher), api.GetStudyGroupById)
}
