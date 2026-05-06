package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionSortTextChoiceCaseListByQuestion(questionId int) ([]constant.QuestionSortTextChoiceDataEntity, error) {
	query := `
		SELECT
			"qstc".*,
			"qt"."saved_text_group_id"
		FROM "question"."question_sort_text_choice"	qstc	
		LEFT JOIN "question"."question_text" qt
			ON "qstc"."question_text_id" = "qt"."id"
		WHERE
			"qstc"."question_sort_id" = $1
	`
	questionSortTextChoiceEntities := []constant.QuestionSortTextChoiceEntity{}
	err := postgresRepository.Database.Select(
		&questionSortTextChoiceEntities,
		query,
		questionId,
	)
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
	answerQuery := `
		SELECT
			"index"
		FROM "question"."question_sort_answer"	
		WHERE
			"question_sort_text_choice_id" = $1	
	`
	questionSortTextChoiceDataEntities := []constant.QuestionSortTextChoiceDataEntity{}
	for _, questionSortTextChoiceEntity := range questionSortTextChoiceEntities {
		savedTextEntities := []constant.SavedTextEntity{}
		err = postgresRepository.Database.Select(&savedTextEntities, savedTextQuery, questionSortTextChoiceEntity.SavedTextGroupId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		translations := map[string]constant.SavedTextEntity{}
		for _, savedTextEntity := range savedTextEntities {
			translations[savedTextEntity.Language] = savedTextEntity
		}

		questionSortTextChoiceDataEntity := constant.QuestionSortTextChoiceDataEntity{
			QuestionSortTextChoiceEntity: &questionSortTextChoiceEntity,
			Translations:                 translations,
		}

		answerIndexes := []int{}
		err = postgresRepository.Database.Select(&answerIndexes, answerQuery, questionSortTextChoiceEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		questionSortTextChoiceDataEntity.AnswerIndexes = answerIndexes

		questionSortTextChoiceDataEntities = append(questionSortTextChoiceDataEntities, questionSortTextChoiceDataEntity)
	}

	return questionSortTextChoiceDataEntities, nil
}
