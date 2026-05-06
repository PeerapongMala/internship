package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupUpdate(tx *sqlx.Tx, questionGroup *constant.QuestionGroupEntity) (*constant.QuestionGroupEntity, error) {
	baseQuery := `
		UPDATE "question"."question_group" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if questionGroup.ChoiceType != "" {
		query = append(query, fmt.Sprintf(` "choice_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionGroup.ChoiceType)
	}
	if questionGroup.CanReuseChoice != nil {
		query = append(query, fmt.Sprintf(` "can_reuse_choice" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionGroup.CanReuseChoice)
	}
	if questionGroup.GroupAmount != 0 {
		query = append(query, fmt.Sprintf(` "group_amount" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionGroup.GroupAmount)
	}
	if questionGroup.ChoiceAmount != 0 {
		query = append(query, fmt.Sprintf(` "choice_amount" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionGroup.GroupAmount)
	}
	if questionGroup.DummyAmount != 0 {
		query = append(query, fmt.Sprintf(` "dummy_amount" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionGroup.DummyAmount)
	}
	if questionGroup.UseSoundDescriptionOnly != nil {
		query = append(query, fmt.Sprintf(` "use_sound_description_only" = $%d`, argsIndex))
		argsIndex++
		args = append(args, questionGroup.UseSoundDescriptionOnly)
	}

	questionGroupEntity := constant.QuestionGroupEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "question_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, questionGroup.QuestionId)

		err := tx.QueryRowx(baseQuery, args...).StructScan(&questionGroupEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery := `
			SELECT
				*
			FROM "question"."question_group"
			WHERE
				"question_id" = $1	
		`
		err := tx.QueryRowx(baseQuery, questionGroup.QuestionId).StructScan(&questionGroupEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &questionGroupEntity, nil
}
