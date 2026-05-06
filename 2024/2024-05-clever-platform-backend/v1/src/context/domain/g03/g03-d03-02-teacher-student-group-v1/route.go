package g03D0302TeacherStudentGroupV1

import (
	constRole "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	service01 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, path string, serviceInstance service.ServiceInterface, serviceInstance01 service01.ServiceInterface) {
	api := service.NewApiStruct(serviceInstance, serviceInstance01)

	app.Get(path+"/student-group/member/student_group/:student_group_id", authMiddleware.CheckRoles(constRole.Teacher), api.GetStudyGroupByClassID)
	app.Patch(path+"/student-group/member/study_group/:study_group_id/bulk-edit", authMiddleware.CheckRoles(constRole.Teacher), api.PatchStudentGroupMemberByID)
}
