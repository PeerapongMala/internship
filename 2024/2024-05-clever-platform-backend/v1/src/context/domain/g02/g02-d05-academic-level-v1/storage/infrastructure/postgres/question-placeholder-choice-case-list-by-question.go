package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderChoiceCaseListByQuestion(questionId int) ([]constant.QuestionPlaceholderTextChoiceEntity, error) {
	query := `
		SELECT
			"qptc".*,
			"qt"."saved_text_group_id"
		FROM "question"."question_placeholder_text_choice" qptc
		LEFT JOIN "question"."question_text" qt
			ON "qptc"."question_text_id" = "qt"."id"
		WHERE
			"qptc"."question_placeholder_id" = $1
	`
	questionPlaceholderTextChoiceEntities := []constant.QuestionPlaceholderTextChoiceEntity{}
	err := postgresRepository.Database.Select(&questionPlaceholderTextChoiceEntities, query, questionId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	savedTextQuery := `
		SELECt
			*
		FROM "curriculum_group"."saved_text"
		WHERE
			"group_id" = $1
	`
	// descriptionIndexesQuery := `
	// 	SELECT
	// 		"qpa"."answer_index",
	// 		"qt"."index"
	// 	FROM "question"."question_placeholder_answer" qpa
	// 	LEFT JOIN "question"."question_text" qt
	// 		ON "qpa"."question_text_description_id" = "qt"."id"
	// 	WHERE
	// 		"qpa"."question_placeholder_text_choice_id" = $1
	// `
	// questionPlaceholderDataEntities := []constant.QuestionPlaceholderTextChoiceDataEntity{}
	for i, questionPlaceholderTextChoiceEntity := range questionPlaceholderTextChoiceEntities {
		// questionPlaceholderTextChoiceDataEntity := constant.QuestionPlaceholderTextChoiceDataEntity{}
		savedTextEntities := []constant.SavedTextEntity{}
		err := postgresRepository.Database.Select(&savedTextEntities, savedTextQuery, questionPlaceholderTextChoiceEntity.SavedTextGroupId)
		if err != nil {
			return nil, err
		}

		for _, savedTextEntity := range savedTextEntities {
			if /*savedTextEntity.Language == constant.English &&*/ savedTextEntity.Text != nil {
				questionPlaceholderTextChoiceEntities[i].SpeechUrl = savedTextEntity.SpeechUrl
				questionPlaceholderTextChoiceEntities[i].Text = *savedTextEntity.Text
			}
		}

		// questionPlaceholderDescriptionIndexEntities := []constant.QuestionPlaceholderDescriptionIndexEntity{}
		// err = postgresRepository.Database.Select(&questionPlaceholderDescriptionIndexEntities, descriptionIndexesQuery, questionPlaceholderTextChoiceEntity.Id)
		// if err != nil {
		// 	log.Printf("%+v", errors.WithStack(err))
		// 	return nil, err
		// }
		// questionPlaceholderTextChoiceEntity.DescriptionIndexes = questionPlaceholderDescriptionIndexEntities
		// questionPlaceholderTextChoiceDataEntity.QuestionPlaceholderTextChoiceEntity = &questionPlaceholderTextChoiceEntity

		// translations := map[string]constant.SavedTextEntity{}
		// for _, savedTextEntity := range savedTextEntities {
		// 	translations[savedTextEntity.Language] = savedTextEntity
		// }
		// questionPlaceholderTextChoiceDataEntity.Translations = translations

		// questionPlaceholderDataEntities = append(questionPlaceholderDataEntities, questionPlaceholderTextChoiceDataEntity)
	}

	return questionPlaceholderTextChoiceEntities, nil
}
