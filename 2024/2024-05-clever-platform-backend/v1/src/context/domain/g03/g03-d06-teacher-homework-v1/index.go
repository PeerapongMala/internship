package g03D12TeacherProfileV1

import (
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	teacherHomeWorkService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/service"
	teacherHomeWorkStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) teacherHomeWorkService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	teacherProfileStorageInstance := teacherHomeWorkStorage.StorageNew(resource)
	teacherHomeWorkServiceInstance := teacherHomeWorkService.ServiceNew(teacherProfileStorageInstance)

	route(app, authMiddleware, teacherHomeWorkServiceInstance, path)

	return teacherHomeWorkServiceInstance
}
