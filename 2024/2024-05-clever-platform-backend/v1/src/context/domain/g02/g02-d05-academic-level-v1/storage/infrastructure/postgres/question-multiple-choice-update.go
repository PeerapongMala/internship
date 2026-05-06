package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceUpdate(tx *sqlx.Tx, questionMultipleChoice *constant.QuestionMultipleChoiceEntity) (*constant.QuestionMultipleChoiceEntity, error) {
	baseQuery := `
		UPDATE "question"."question_multiple_choice" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if questionMultipleChoice.ChoiceType != "" {
		query = append(query, fmt.Sprintf(` "choice_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionMultipleChoice.ChoiceType)
	}
	if questionMultipleChoice.UseSoundDescriptionOnly != nil {
		query = append(query, fmt.Sprintf(` "use_sound_description_only" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionMultipleChoice.UseSoundDescriptionOnly)
	}
	if questionMultipleChoice.CorrectChoiceAmount != "" {
		query = append(query, fmt.Sprintf(` "correct_choice_amount" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionMultipleChoice.CorrectChoiceAmount)
	}
	if questionMultipleChoice.MaxPoint != nil {
		query = append(query, fmt.Sprintf(` "max_point" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionMultipleChoice.MaxPoint)
	}

	questionMultipleChoiceEntity := constant.QuestionMultipleChoiceEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "question_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, questionMultipleChoice.QuestionId)

		err := tx.QueryRowx(baseQuery, args...).StructScan(&questionMultipleChoiceEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery = `
			SELECT
				*
			FROM "question"."question_multiple_choice"
			WHERE
				"question_id" = $1	
		`
		err := tx.QueryRowx(baseQuery, questionMultipleChoice.QuestionId).StructScan(&questionMultipleChoiceEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &questionMultipleChoiceEntity, nil
}
