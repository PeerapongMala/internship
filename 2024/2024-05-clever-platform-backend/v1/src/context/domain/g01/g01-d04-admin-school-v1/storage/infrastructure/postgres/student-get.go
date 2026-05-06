package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentGet(userId string) (*constant.StudentEntity, error) {
	query := `
		SELECT
			*
		FROM
			"user"."student"	
		WHERE
			"user_id" = $1
	`
	studentEntity := constant.StudentEntity{}
	err := postgresRepository.Database.QueryRowx(query, userId).StructScan(&studentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &studentEntity, nil
}
