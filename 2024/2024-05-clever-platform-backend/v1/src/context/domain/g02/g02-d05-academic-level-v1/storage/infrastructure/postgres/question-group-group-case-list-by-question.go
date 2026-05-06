package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupGroupCaseListByQuestion(tx *sqlx.Tx, questionId int) ([]constant.QuestionGroupGroupDataEntity, error) {
	var queryMethod func(dest interface{}, query string, args ...interface{}) error
	if tx != nil {
		queryMethod = tx.Select
	} else {
		queryMethod = postgresRepository.Database.Select
	}
	query := `
		SELECT
			"qgg".*,
			"qt"."saved_text_group_id"
		FROM "question"."question_group_group" "qgg"
		LEFT JOIN "question"."question_text" "qt"
			ON "qgg"."question_text_id" = "qt"."id"
		WHERE
			"qgg"."question_group_id" = $1
	`
	questionGroupGroupDataEntities := []constant.QuestionGroupGroupDataEntity{}
	err := queryMethod(&questionGroupGroupDataEntities, query, questionId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		SELECT
			*
		FROM "curriculum_group"."saved_text"
		WHERE
			"group_id" = $1
	`
	for i, questionGroupGroupDataEntity := range questionGroupGroupDataEntities {
		savedTextEntities := []constant.SavedTextEntity{}
		err = queryMethod(&savedTextEntities, query, questionGroupGroupDataEntity.SavedTextGroupId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		translations := map[string]constant.SavedTextEntity{}
		for _, savedTextEntity := range savedTextEntities {
			translations[savedTextEntity.Language] = savedTextEntity
		}

		questionGroupGroupDataEntity.Translations = translations
		questionGroupGroupDataEntities[i] = questionGroupGroupDataEntity
	}

	return questionGroupGroupDataEntities, nil
}
