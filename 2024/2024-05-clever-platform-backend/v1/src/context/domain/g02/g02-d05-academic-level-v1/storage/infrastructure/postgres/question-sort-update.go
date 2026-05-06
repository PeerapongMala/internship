package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionSortUpdate(tx *sqlx.Tx, questionSort *constant.QuestionSortEntity) (*constant.QuestionSortEntity, error) {
	baseQuery := `
		UPDATE "question"."question_sort" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if questionSort.UseSoundDescriptionOnly != nil {
		query = append(query, fmt.Sprintf(` "use_sound_description_only" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionSort.UseSoundDescriptionOnly)
	}
	if questionSort.ChoiceAmount != 0 {
		query = append(query, fmt.Sprintf(` "choice_amount" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionSort.ChoiceAmount)
	}
	if questionSort.CanReuseChoice != nil {
		query = append(query, fmt.Sprintf(` "can_reuse_choice" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionSort.CanReuseChoice)
	}
	if questionSort.DummyAmount != nil {
		query = append(query, fmt.Sprintf(` "dummy_amount" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionSort.DummyAmount)
	}

	questionSortEntity := constant.QuestionSortEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "question_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, questionSort.QuestionId)

		err := tx.QueryRowx(baseQuery, args...).StructScan(&questionSortEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery := `
			SELECT
				*
			FROM "question"."question_sort"
			WHERE
				"question_id" = $1	
		`
		err := tx.QueryRowx(baseQuery, questionSort.QuestionId).StructScan(&questionSortEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &questionSortEntity, nil
}
