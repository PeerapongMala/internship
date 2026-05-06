package g03D11teacherchatv1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	// Websocket
	app.Get(path+"/ws/school/:school_id/room/:room_type/id/:room_id", authMiddleware.CheckRolesChat(constant.Teacher, constant.Student), api.HandleWebSocket)
	app.Get(path+"/ws/observe/:school_id", authMiddleware.CheckRolesChat(constant.Teacher, constant.Student), api.UpdateChatList)

	// Rest API
	app.Get(path+"/chatHistoryList/school/:school_id/room/:room_type/id/:room_id", authMiddleware.CheckRoles(constant.Teacher, constant.Student), api.ChatHistoryList)
	app.Get(path+"/chats/teacher/school/:school_id", authMiddleware.CheckRoles(constant.Teacher), api.ChatListTeacher)
	app.Get(path+"/chats/student/school/:school_id", authMiddleware.CheckRoles(constant.Student), api.ChatListStudent)
	app.Get(path+"/rooms/:roomId/members", authMiddleware.CheckRoles(constant.Teacher), api.MemberList)
	app.Post(path+"/init-message/:school_id/:reciever_id", authMiddleware.CheckRoles(constant.Teacher), api.InitMessage)
	app.Post(path+"/send-message/:school_id", authMiddleware.CheckRoles(constant.Teacher), api.SendMessage)
}
