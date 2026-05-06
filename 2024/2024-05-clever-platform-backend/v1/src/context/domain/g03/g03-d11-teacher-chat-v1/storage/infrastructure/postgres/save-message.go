package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) SaveMessage(message *constant.Message) (*constant.Message, error) {
	query := `
		INSERT INTO "message"."messages" (
			"sender_id",
			"room_id",
			"content",
			"created_at",
			"room_type",
			"school_id",
			"receiver_id"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING *;
	`
	// _, err := postgresRepository.Database.Exec(
	// 	query,
	// 	message.SenderID,
	// 	message.RoomID,
	// 	message.Content,
	// 	message.CreatedAt,
	// 	message.RoomType,
	// 	message.SchoolID,
	// 	message.ReceiverID,
	// )
	var message_ constant.Message
	args := []interface{}{message.SenderID, message.RoomID, message.Content, message.CreatedAt, message.RoomType, message.SchoolID, message.ReceiverID}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&message_)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &message_, nil
}
