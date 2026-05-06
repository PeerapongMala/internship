package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionUpdate(tx *sqlx.Tx, question *constant.QuestionEntity) (*constant.QuestionEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		QueryMethod = tx.QueryRowx
	} else {
		QueryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "question"."question" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if question.Index != 0 {
		query = append(query, fmt.Sprintf(` "index" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.Index)
	}
	if question.TimerType != "" {
		query = append(query, fmt.Sprintf(` "timer_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.TimerType)
	}
	if question.TimerTime != 0 {
		query = append(query, fmt.Sprintf(` "timer_time" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.TimerTime)
	}
	if question.ChoicePosition != "" {
		query = append(query, fmt.Sprintf(` "choice_position" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.ChoicePosition)
	}
	if question.Layout != "" {
		query = append(query, fmt.Sprintf(` "layout" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.Layout)
	}
	if question.LeftBoxColumns != "" {
		query = append(query, fmt.Sprintf(` "left_box_columns" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.LeftBoxColumns)
	}
	if question.LeftBoxRows != "" {
		query = append(query, fmt.Sprintf(` "left_box_rows" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.LeftBoxRows)
	}
	if question.BottomBoxColumns != "" {
		query = append(query, fmt.Sprintf(` "bottom_box_columns" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.BottomBoxColumns)
	}
	if question.BottomBoxRows != "" {
		query = append(query, fmt.Sprintf(` "bottom_box_rows" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.BottomBoxRows)
	}
	if question.EnforceDescriptionLanguage != nil {
		query = append(query, fmt.Sprintf(` "enforce_description_language" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.EnforceDescriptionLanguage)
	}
	if question.EnforceChoiceLanguage != nil {
		query = append(query, fmt.Sprintf(` "enforce_choice_language" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.EnforceChoiceLanguage)
	}

	if question.DeleteDescriptionImage {
		query = append(query, fmt.Sprintf(` "image_description_url" = NULL`))
	} else {
		query = append(query, fmt.Sprintf(` "image_description_url" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.ImageDescriptionUrl)
	}

	if question.DeleteHintImage {
		query = append(query, fmt.Sprintf(` "image_hint_url" = NULL`))
	} else {
		query = append(query, fmt.Sprintf(` "image_hint_url" = $%d`, argsIndex))
		argsIndex++
		args = append(args, question.ImageHintUrl)
	}

	questionEntity := constant.QuestionEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, question.Id)

		log.Println(baseQuery)
		err := QueryMethod(
			baseQuery,
			args...,
		).StructScan(&questionEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery = `
			SELECT 
				*
			FROM "question"."question"
			WHERE
				"id" = $1	
		`
		err := QueryMethod(baseQuery, question.Id).StructScan(&questionEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &questionEntity, nil
}
