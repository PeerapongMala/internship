package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionCreate(tx *sqlx.Tx, question *constant.QuestionEntity) (*constant.QuestionEntity, error) {
	query := `
		INSERT INTO "question"."question" (
			"level_id", 
			"index",
			"question_type",
			"timer_type",
			"timer_time",
			"choice_position",	
			"layout",
			"left_box_columns",
			"left_box_rows",
			"bottom_box_columns",
			"bottom_box_rows",
			"image_description_url",
			"image_hint_url",
			"enforce_description_language",
			"enforce_choice_language"
		)	
		VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING *
	`
	questionEntity := constant.QuestionEntity{}
	err := tx.QueryRowx(
		query,
		question.LevelId,
		question.Index,
		question.QuestionType,
		question.TimerType,
		question.TimerTime,
		question.ChoicePosition,
		question.Layout,
		question.LeftBoxColumns,
		question.LeftBoxRows,
		question.BottomBoxColumns,
		question.BottomBoxRows,
		question.ImageDescriptionUrl,
		question.ImageHintUrl,
		question.EnforceDescriptionLanguage,
		question.EnforceChoiceLanguage,
	).StructScan(&questionEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionEntity, nil
}
