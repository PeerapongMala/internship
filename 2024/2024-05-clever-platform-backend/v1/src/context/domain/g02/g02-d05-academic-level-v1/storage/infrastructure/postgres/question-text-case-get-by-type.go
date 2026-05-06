package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionTextCaseGetByType(questionId int, textType string, isMainDescription ...*bool) (*constant.QuestionTextDataEntity, error) {
	questionTextDataEntity := constant.QuestionTextDataEntity{}
	query := `
		SELECT
			*
		FROM "question"."question_text"	
		WHERE
			"question_id" = $1
			AND
			"type" = $2
	`
	args := []interface{}{questionId, textType}

	if len(isMainDescription) > 0 && isMainDescription[0] != nil && *isMainDescription[0] == true {
		query += ` AND "index" IS NULL`
	}

	questionTextEntity := constant.QuestionTextEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		args...,
	).StructScan(&questionTextEntity)
	if err != nil {
		if err == sql.ErrNoRows {
			return &questionTextDataEntity, nil
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionTextDataEntity.QuestionTextEntity = questionTextEntity

	query = `
		SELECT
			*
		FROM "curriculum_group"."saved_text"	
		WHERE
			"group_id" = $1
	`

	savedTextEntities := []constant.SavedTextEntity{}
	err = postgresRepository.Database.Select(&savedTextEntities, query, questionTextEntity.SavedTextGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	translations := map[string]constant.SavedTextEntity{}
	for _, savedTextEntity := range savedTextEntities {
		translations[savedTextEntity.Language] = savedTextEntity
	}
	questionTextDataEntity.Translations = translations

	return &questionTextDataEntity, nil
}
