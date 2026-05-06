package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionSortGet(questionSortId int) (*constant.QuestionSortEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question_sort"	
		WHERE
			"question_id" = $1
	`
	questionSortEntity := constant.QuestionSortEntity{}
	err := postgresRepository.Database.QueryRowx(query, questionSortId).StructScan(&questionSortEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionSortEntity, nil
}
