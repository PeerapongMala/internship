package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) SaveMultipleMessage(tx *sqlx.Tx, message *constant.Message) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

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

	args := []interface{}{message.SenderID, message.RoomID, message.Content, message.CreatedAt, message.RoomType, message.SchoolID, message.ReceiverID}
	_, err := queryMethod(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
