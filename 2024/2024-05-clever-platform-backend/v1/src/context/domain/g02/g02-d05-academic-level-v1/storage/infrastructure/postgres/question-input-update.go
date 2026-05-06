package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionInputUpdate(tx *sqlx.Tx, questionInput *constant.QuestionInputEntity) (*constant.QuestionInputEntity, error) {
	baseQuery := `
		UPDATE "question"."question_input" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if questionInput.HintType != "" {
		query = append(query, fmt.Sprintf(` "hint_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionInput.HintType)
	}
	if questionInput.InputType != "" {
		query = append(query, fmt.Sprintf(` "input_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionInput.InputType)
	}
	if questionInput.UseSoundDescriptionOnly != nil {
		query = append(query, fmt.Sprintf(` "use_sound_description_only" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionInput.UseSoundDescriptionOnly)
	}

	questionInputEntity := constant.QuestionInputEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "question_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, questionInput.QuestionId)

		err := tx.QueryRowx(baseQuery, args...).StructScan(&questionInputEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery := `
			SELECT
				*
			FROM "question"."question_input"
			WHERE
				"question_id" = $1	
		`
		err := tx.QueryRowx(baseQuery, questionInput.QuestionId).StructScan(&questionInputEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &questionInputEntity, nil
}
