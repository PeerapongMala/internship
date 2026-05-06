package g02D02AcademicCourse

import (
	authStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	academicCourseService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/service"
	academicCourseStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) academicCourseService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	academicCourseStorageInstance := academicCourseStorage.StorageNew(resource)
	authStorageInstance := authStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)

	academicCourseServiceInstance := academicCourseService.ServiceNew(academicCourseStorageInstance, authStorageInstance, cloudStorageInstance)
	route(app, authMiddleware, academicCourseServiceInstance, path)
	return academicCourseServiceInstance
}
