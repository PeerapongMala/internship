package g03D03TeacherStudentGroupV1

import (
	AuthMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/storage"
	TeacherStudentStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/storage"

	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) {
	authMiddlewareStorage := AuthMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorage)

	teacherStudentGroupStorage := storage.StorageNew(resource)
	teacherStudentStorage := TeacherStudentStorage.StorageTeacherStudentNew(resource)

	teacherStudentService := service.ServiceTeacherStudentNew(
		teacherStudentGroupStorage,
		teacherStudentStorage,
	)

	route(app, authMiddleware, teacherStudentService, path)
}
