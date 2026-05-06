package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionCaseListByLevelId(levelId int, pagination *helper.Pagination) ([]constant.QuestionEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question"
		WHERE
			"level_id" = $1	
	`
	args := []interface{}{levelId}
	argsIndex := 2

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY index OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	questionEntities := []constant.QuestionEntity{}
	err := postgresRepository.Database.Select(&questionEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
	}

	return questionEntities, nil
}
