package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) ChatHistoryList(in *constant.ListInput) ([]*constant.MessageList, error) {
	query := `
		WITH cte_base as ( 
				SELECT 
					m.id,
					m.school_id,
					m.room_id,
					m.room_type,
					m.sender_id,
					m.content,
					m.created_at, 
					u.first_name,
					u.last_name,
					u.image_url
				FROM "message"."messages" m
				LEFT JOIN "user"."user" u ON m.sender_id = u.id
				WHERE m.room_id = $1 AND 
					m.created_at < $2 AND 
					m.school_id = $3 AND 
					m.room_type = $4
				ORDER BY m.created_at desc
				LIMIT $5
		)
		SELECT *
		FROM cte_base
		ORDER BY created_at
	`
	args := []interface{}{in.RoomID, in.BeforeTime, in.SchoolID, in.RoomType, in.Limit}
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	messages := []*constant.MessageList{}
	for rows.Next() {
		message := constant.MessageList{}
		err := rows.Scan(
			&message.Message.ID,
			&message.Message.SchoolID,
			&message.Message.RoomID,
			&message.Message.RoomType,
			&message.Message.SenderID,
			&message.Message.Content,
			&message.Message.CreatedAt,
			&message.FirstName,
			&message.Lastname,
			&message.ImageUrl,
		)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		messages = append(messages, &message)
	}

	return messages, nil
}
