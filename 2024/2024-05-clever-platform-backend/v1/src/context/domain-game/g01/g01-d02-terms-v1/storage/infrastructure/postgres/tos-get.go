package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TosGet(tosId int) (*constant.TosEntity, error) {
	query := `
		SELECT
			"version",
			"content",
			"updated_at",	
			"created_at"
		FROM
		    "tos"."tos"
		WHERE
		    "id" = $1
	`
	tos := constant.TosEntity{}
	err := postgresRepository.Database.Get(&tos, query, tosId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &tos, nil
}
