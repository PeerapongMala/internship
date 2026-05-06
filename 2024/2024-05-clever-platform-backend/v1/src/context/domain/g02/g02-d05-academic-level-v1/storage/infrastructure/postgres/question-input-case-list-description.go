package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionInputCaseListDescription(questionId int) ([]constant.QuestionInputDescriptionEntity, error) {
	questionInputDescriptionEntities := []constant.QuestionInputDescriptionEntity{}

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

	questionInputAnswerQuery := `
		SELECT
			*
		FROM "question"."question_input_answer"
		WHERE
			"question_text_description_id" = $1	
	`
	queryInputAnswerTextQuery := `
		SELECT 
			"qiat".*,
			"qt"."saved_text_group_id"
		FROM "question"."question_input_answer_text" qiat
		LEFT JOIN "question"."question_text" qt
			ON "qiat"."question_text_id" = "qt"."id"
		WHERE
			"question_input_answer_id" = $1
	`
	savedTextQuery := `
		SELECT
			*
		FROM "curriculum_group"."saved_text"
		WHERE
			"group_id" = $1	
	`
	for _, description := range descriptions {
		questionInputDescriptionEntity := constant.QuestionInputDescriptionEntity{}
		if description.Index != nil {
			questionInputDescriptionEntity.Index = *description.Index
		}
		questionInputDescriptionEntity.Id = description.Id

		// translations := map[string]constant.SavedTextEntity{}
		savedTextEntities := []constant.SavedTextEntity{}

		err := postgresRepository.Database.Select(&savedTextEntities, savedTextQuery, description.SavedTextGroupId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		for _, savedTextEntity := range savedTextEntities {
			if savedTextEntity.Text != nil {
				questionInputDescriptionEntity.Text = *savedTextEntity.Text
			}
			questionInputDescriptionEntity.SpeechUrl = savedTextEntity.SpeechUrl
			questionInputDescriptionEntity.Language = &savedTextEntity.Language
		}

		questionInputAnswerEntities := []constant.QuestionInputAnswerEntity{}
		err = postgresRepository.Database.Select(&questionInputAnswerEntities, questionInputAnswerQuery, description.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		questionInputDescriptionAnswerEntities := []constant.QuestionInputDescriptionAnswerEntity{}
		for _, questionInputAnswerEntity := range questionInputAnswerEntities {
			questionInputDescriptionAnswerEntity := constant.QuestionInputDescriptionAnswerEntity{}
			questionInputDescriptionAnswerEntity.Index = questionInputAnswerEntity.AnswerIndex
			questionInputDescriptionAnswerEntity.Type = *questionInputAnswerEntity.Type
			questionInputDescriptionAnswerEntity.Id = questionInputAnswerEntity.Id

			questionInputAnswerTextEntities := []constant.QuestionInputAnswerTextEntity{}
			err = postgresRepository.Database.Select(&questionInputAnswerTextEntities, queryInputAnswerTextQuery, questionInputAnswerEntity.Id)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			questionInputDescriptionAnswerTextEntities := []constant.QuestionInputDescriptionAnswerTextEntity{}
			for _, questionInputAnswerTextEntity := range questionInputAnswerTextEntities {
				questionInputDescriptionAnswerTextEntity := constant.QuestionInputDescriptionAnswerTextEntity{}
				questionInputDescriptionAnswerTextEntity.Index = questionInputAnswerTextEntity.Index
				// if questionInputDescriptionAnswerEntity.Type == constant.AnswerTypeNormal {
				// 	questionInputDescriptionAnswerTextEntity.SavedTextGroupId = questionInputAnswerTextEntity.SavedTextGroupId
				// }

				savedTextEntities := []constant.SavedTextEntity{}
				err := postgresRepository.Database.Select(&savedTextEntities, savedTextQuery, questionInputAnswerTextEntity.SavedTextGroupId)
				if err != nil {
					log.Printf("%+v", errors.WithStack(err))
					return nil, err
				}

				// 	log.Println(len(savedTextEntities))
				translations := map[string]constant.SavedTextEntity{}
				for _, savedTextEntity := range savedTextEntities {
					translations[savedTextEntity.Language] = savedTextEntity
					// if questionInputDescriptionAnswerEntity.Type != constant.AnswerTypeNormal {
					questionInputDescriptionAnswerTextEntity.Text = *savedTextEntity.Text
					// }
				}

				// if questionInputDescriptionAnswerEntity.Type == constant.AnswerTypeNormal {
				// 	questionInputDescriptionAnswerTextEntity.Translations = translations
				// }
				questionInputDescriptionAnswerTextEntities = append(questionInputDescriptionAnswerTextEntities, questionInputDescriptionAnswerTextEntity)
			}
			questionInputDescriptionAnswerEntity.Text = questionInputDescriptionAnswerTextEntities
			questionInputDescriptionAnswerEntities = append(questionInputDescriptionAnswerEntities, questionInputDescriptionAnswerEntity)
			questionInputDescriptionEntity.Answers = questionInputDescriptionAnswerEntities

		}

		questionInputDescriptionEntities = append(questionInputDescriptionEntities, questionInputDescriptionEntity)
	}

	return questionInputDescriptionEntities, nil
}
