package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/contrib/websocket"
)

type ServiceInterface interface {
	HandleWebSocket(conn *websocket.Conn, client *constant.Client) error
	ChatHistoryList(in *constant.ListInput) ([]*constant.MessageList, error)
	ValidatePrivilege(req *constant.ValidateRequest) (bool, error)
	ChatListTeacher(filter *constant.ChatFilter, pagination *helper.Pagination) ([]*constant.ChatListTeacher, error)
	ChatListStudent(filter *constant.ChatFilter, pagination *helper.Pagination) ([]*constant.ChatListStudent, error)
	MemberList(in *MemberListInput) (*MemberListOutput, error)
	InitMessage(filter *constant.Message) (*string, error)
}
