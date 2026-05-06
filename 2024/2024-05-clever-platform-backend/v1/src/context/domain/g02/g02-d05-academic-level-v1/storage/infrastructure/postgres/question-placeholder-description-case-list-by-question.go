package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderDescriptionCaseListByQuestion(questionId int) ([]constant.QuestionPlaceholderDescriptionEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question_text"
		WHERE
			"question_id" = $1
			AND
			"type" = $2
			AND
		    "index" IS NOT NULL
	`

	descriptions := []constant.QuestionTextEntity{}
	err := postgresRepository.Database.Select(&descriptions, query, questionId, constant.Description)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	savedTextQuery := `
		SELECT
			*
		FROM
			"curriculum_group"."saved_text"
		WHERE
			"group_id" = $1	
	`
	questionPlaceholderAnswerQuery := `
		SELECT
			*
		FROM
			"question"."question_placeholder_answer"	
		WHERE
			"question_text_description_id" = $1
	`
	questionPlaceholderAnswerTextQuery := `
		SELECT
			"index",
			"choice_index"
		FROM
			"question"."question_placeholder_answer_text"
		WHERE
			"question_placeholder_answer_id" = $1
	`
	questionPlaceholderDescriptionEntities := []constant.QuestionPlaceholderDescriptionEntity{}
	for _, description := range descriptions {
		questionPlaceholderDescriptionEntity := constant.QuestionPlaceholderDescriptionEntity{}
		if description.Index != nil {
			questionPlaceholderDescriptionEntity.Index = *description.Index
		}

		savedTextEntities := []constant.SavedTextEntity{}
		err := postgresRepository.Database.Select(&savedTextEntities, savedTextQuery, description.SavedTextGroupId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		for _, savedTextEntity := range savedTextEntities {
			if /*savedTextEntity.Language == constant.English &&*/ savedTextEntity.Text != nil {
				questionPlaceholderDescriptionEntity.SpeechUrl = savedTextEntity.SpeechUrl
				questionPlaceholderDescriptionEntity.Text = *savedTextEntity.Text
				questionPlaceholderDescriptionEntity.Language = &savedTextEntity.Language
				questionPlaceholderDescriptionEntity.SavedTextGroupId = &savedTextEntity.GroupId
			}
		}

		questionPlaceholderAnswerEntities := []constant.QuestionPlaceholderAnswerEntity{}
		err = postgresRepository.Database.Select(&questionPlaceholderAnswerEntities, questionPlaceholderAnswerQuery, description.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		for _, questionPlaceholderAnswerEntity := range questionPlaceholderAnswerEntities {
			questionPlaceholderDescriptionAnswerEntity := constant.QuestionPlaceholderDescriptionAnswerEntity{
				Id:    questionPlaceholderAnswerEntity.Id,
				Index: questionPlaceholderAnswerEntity.AnswerIndex}

			questionPlaceholderDescriptionAnswerTextEntities := []constant.QuestionPlaceholderDescriptionAnswerTextEntity{}
			err := postgresRepository.Database.Select(&questionPlaceholderDescriptionAnswerTextEntities, questionPlaceholderAnswerTextQuery, questionPlaceholderAnswerEntity.Id)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			questionPlaceholderDescriptionAnswerEntity.Text = questionPlaceholderDescriptionAnswerTextEntities

			questionPlaceholderDescriptionEntity.Answers =
				append(
					questionPlaceholderDescriptionEntity.Answers,
					questionPlaceholderDescriptionAnswerEntity,
				)

		}
		// questionPlaceholderDescriptionEntity := constant.QuestionPlaceholderDescriptionEntity{}
		// if description.Index != nil {
		// 	questionPlaceholderDescriptionEntity.Index = *description.Index
		// }
		// savedTextEntities := []constant.SavedTextEntity{}

		// err := postgresRepository.Database.Select(&savedTextEntities, savedTextQuery, description.SavedTextGroupId)
		// if err != nil {
		// 	log.Printf("%+v", errors.WithStack(err))
		// 	return nil, err
		// }

		// for _, savedTextEntity := range savedTextEntities {
		// 	if savedTextEntity.Text != nil {
		// 		questionPlaceholderDescriptionEntity.Text = *savedTextEntity.Text
		// 	}
		// }
		questionPlaceholderDescriptionEntities = append(questionPlaceholderDescriptionEntities, questionPlaceholderDescriptionEntity)
	}

	return questionPlaceholderDescriptionEntities, nil
}
