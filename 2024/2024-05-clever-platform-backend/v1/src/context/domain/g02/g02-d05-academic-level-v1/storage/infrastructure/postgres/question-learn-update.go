package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionLearnUpdate(tx *sqlx.Tx, questionLearn *constant.QuestionLearnEntity) (*constant.QuestionLearnEntity, error) {
	baseQuery := `
		UPDATE "question"."question_learn" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if questionLearn.Text != nil {
		query = append(query, fmt.Sprintf(` "text" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionLearn.Text)
	}
	if questionLearn.Url != nil {
		query = append(query, fmt.Sprintf(` "url" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionLearn.Url)
	}

	if len(query) < 0 {
		return questionLearn, nil
	}

	questionLearnEntity := constant.QuestionLearnEntity{}
	baseQuery += fmt.Sprintf(`%s WHERE "question_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, questionLearn.QuestionId)

	err := tx.QueryRowx(baseQuery, args...).StructScan(&questionLearnEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionLearnEntity, nil
}
