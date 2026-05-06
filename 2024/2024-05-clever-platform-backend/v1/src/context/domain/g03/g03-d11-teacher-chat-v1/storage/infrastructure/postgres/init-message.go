package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) InitMessage(message *constant.Message) (*string, error) {

	queryCheck := `
		SELECT EXISTS (
			SELECT 1
			FROM message.messages
			WHERE room_id = $1 AND school_id = $2
		)
	`

	var haveMessage bool
	var messageResponse string
	args := []interface{}{message.RoomID, message.SchoolID}
	err := postgresRepository.Database.QueryRowx(queryCheck, args...).Scan(&haveMessage)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if haveMessage {
		messageResponse = "Chat history already exists."
		return &messageResponse, nil
	}

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
		VALUES ($1, $2, $3, $4, $5, $6, $7);
	`

	args = []interface{}{message.SenderID, message.RoomID, message.Content, message.CreatedAt, message.RoomType, message.SchoolID, message.ReceiverID}
	_, err = postgresRepository.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	messageResponse = "Chat history initialized successfully."
	return &messageResponse, nil
}
