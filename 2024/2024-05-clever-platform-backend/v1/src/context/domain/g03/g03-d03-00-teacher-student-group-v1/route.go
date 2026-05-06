package g03D00TeacherStudentGroupV1

import (
	constRole "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-00-teacher-student-group-v1/service"
	service01 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, path string, serviceInstance service.ServiceInterface, serviceInstance01 service01.ServiceInterface) {
	api := service.NewApiStruct(serviceInstance, serviceInstance01)

	app.Get(path+"/study-group/school/:school_id", authMiddleware.CheckRoles(constRole.Teacher), api.GetStudyGroupList)
	app.Patch(path+"/study-group/status/bulk-edit", authMiddleware.CheckRoles(constRole.Teacher), api.PatchStudyGroupsStatus)
}
