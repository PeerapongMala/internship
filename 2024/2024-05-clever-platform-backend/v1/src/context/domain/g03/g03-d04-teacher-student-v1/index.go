package g03D04TeacherStudentV1

import (
	AuthStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage"
	cloudStorage2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	AuthMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	UserStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/storage"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) {
	authStorage := AuthStorage.StorageNew(resource)
	userStorage := UserStorage.StorageNew(resource)
	authMiddlewareStorage := AuthMiddlewareStorage.StorageNew(resource)
	teacherStudentStorage := storage.StorageTeacherStudentNew(resource)
	cloudStorage := cloudStorage2.StorageNew(resource)

	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorage)
	teacherStudentService := service.ServiceTeacherStudentNew(
		teacherStudentStorage,
		authStorage,
		userStorage,
		cloudStorage,
	)

	route(app, authMiddleware, teacherStudentService, path)
}
