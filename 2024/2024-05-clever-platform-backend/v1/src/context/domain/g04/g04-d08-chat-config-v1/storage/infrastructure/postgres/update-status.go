package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d08-chat-config-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UpdateStatus(req *constant.Config) error {
	query := `
		UPDATE message.chat_config
		SET is_enabled = $1
		WHERE chat_level = $2;
	`

	agrs := []interface{}{req.Status, req.ChatLevel}
	_, err := postgresRepository.Database.Exec(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
