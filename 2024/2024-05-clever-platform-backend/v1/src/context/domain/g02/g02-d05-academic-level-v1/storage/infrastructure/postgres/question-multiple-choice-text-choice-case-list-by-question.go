package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceTextChoiceCaseListByQuestion(questionId int) ([]constant.QuestionMultipleChoiceTextChoiceDataEntity, error) {
	query := `
		SELECT
			"qmctc".*,
			"qt"."saved_text_group_id"
		FROM "question"."question_multiple_choice_text_choice" qmctc
		LEFT JOIN "question"."question_text" qt
			ON "qmctc"."question_text_id" = "qt"."id"
		WHERE
			"question_multiple_choice_id" = $1
	`
	questionMultipleChoiceTextChoiceEntities := []constant.QuestionMultipleChoiceTextChoiceEntity{}
	err := postgresRepository.Database.Select(&questionMultipleChoiceTextChoiceEntities, query, questionId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	savedTextQuery := `
		SELECT
			*
		FROM "curriculum_group"."saved_text"	
		WHERE
			"group_id" = $1
	`
	questionMultipleChoiceTextChoiceDataEntities := []constant.QuestionMultipleChoiceTextChoiceDataEntity{}
	for _, questionMultipleChoiceTextChoiceEntity := range questionMultipleChoiceTextChoiceEntities {
		savedTextEntities := []constant.SavedTextEntity{}

		err = postgresRepository.Database.Select(&savedTextEntities, savedTextQuery, questionMultipleChoiceTextChoiceEntity.SavedTextGroupId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		translations := map[string]constant.SavedTextEntity{}
		for _, savedTextEntity := range savedTextEntities {
			translations[savedTextEntity.Language] = savedTextEntity
		}
		questionMultipleChoiceTextChoiceDataEntity := constant.QuestionMultipleChoiceTextChoiceDataEntity{
			QuestionMultipleChoiceTextChoiceEntity: &questionMultipleChoiceTextChoiceEntity,
			Translations:                           translations,
		}
		questionMultipleChoiceTextChoiceDataEntities = append(questionMultipleChoiceTextChoiceDataEntities, questionMultipleChoiceTextChoiceDataEntity)
	}

	return questionMultipleChoiceTextChoiceDataEntities, nil
}
