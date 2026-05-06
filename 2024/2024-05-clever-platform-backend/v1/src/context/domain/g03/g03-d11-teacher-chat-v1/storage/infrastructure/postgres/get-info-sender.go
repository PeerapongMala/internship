package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) GetInformationSender(userID string) (*constant.MessageList, error) {
	query := `
		SELECT 
			u.first_name,
			u.last_name,
			u.image_url
		FROM "user"."user" u
		WHERE u.id = $1
	`

	args := []interface{}{userID}
	info := constant.MessageList{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&info)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &info, nil
}
