package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d08-chat-config-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ConfigList(pagination *helper.Pagination) ([]*constant.Config, error) {
	query := `
		SELECT 
			cc.chat_level,
			cc.is_enabled	
		FROM message.chat_config cc
		OFFSET $1 LIMIT $2
	`

	args := []interface{}{pagination.Offset, pagination.Limit}
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(
		countQuery,
		args...,
	).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var configs []*constant.Config
	for rows.Next() {
		config := constant.Config{}
		err := rows.StructScan(&config)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		configs = append(configs, &config)
	}
	return configs, nil
}
