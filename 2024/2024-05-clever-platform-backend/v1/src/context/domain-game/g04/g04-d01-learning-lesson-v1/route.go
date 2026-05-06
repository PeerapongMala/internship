package g04D01LearningLessonV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Get(path+"/subject/:subjectId/lessons", authMiddleware.CheckRoles(constant.Student), api.LearningLessonList)
	app.Get(path+"/lesson/:lessonId", authMiddleware.CheckRoles(constant.Student), api.LearningLessonGet)
	app.Get(path+"/lesson/:lessonId/sublessons", authMiddleware.CheckRoles(constant.Student), api.LearningSublessonList)
	app.Get(path+"/sublesson/:sublessonId", authMiddleware.CheckRoles(constant.Student), api.LearningSubessonGet)
}
