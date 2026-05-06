package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderUpdate(tx *sqlx.Tx, questionPlaceholder *constant.QuestionPlaceholderEntity) (*constant.QuestionPlaceholderEntity, error) {
	baseQuery := `
		UPDATE "question"."question_placeholder" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if questionPlaceholder.CanReuseChoice != nil {
		query = append(query, fmt.Sprintf(` "can_reuse_choice" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionPlaceholder.CanReuseChoice)
	}
	if questionPlaceholder.ChoiceAmount != 0 {
		query = append(query, fmt.Sprintf(` "choice_amount" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionPlaceholder.ChoiceAmount)
	}
	if questionPlaceholder.DummyAmount != nil {
		query = append(query, fmt.Sprintf(` "dummy_amount" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionPlaceholder.DummyAmount)
	}
	if questionPlaceholder.HintType != "" {
		query = append(query, fmt.Sprintf(` "hint_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionPlaceholder.HintType)
	}
	if questionPlaceholder.UseSoundDescriptionOnly != nil {
		query = append(query, fmt.Sprintf(` "use_sound_description_only" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionPlaceholder.UseSoundDescriptionOnly)
	}

	questionPlaceholderEntity := constant.QuestionPlaceholderEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "question_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, questionPlaceholder.QuestionId)

		err := tx.QueryRowx(baseQuery, args...).StructScan(&questionPlaceholderEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery := `
			SELECT
				*
			FROM "question"."question_placeholder"	
			WHERE
				"question_id" = $1
		`
		err := tx.QueryRowx(baseQuery, questionPlaceholder.QuestionId).StructScan(&questionPlaceholderEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &questionPlaceholderEntity, nil
}
