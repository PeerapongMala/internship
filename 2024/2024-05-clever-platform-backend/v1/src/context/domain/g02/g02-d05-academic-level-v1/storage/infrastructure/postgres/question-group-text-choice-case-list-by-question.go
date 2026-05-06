package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupChoiceCaseListByQuestion(questionId int) ([]constant.QuestionGroupChoiceDataEntity, error) {
	query := `
		SELECT
			"qgc".*,
			"qt"."saved_text_group_id"
		FROM "question"."question_group_choice" qgc	
		LEFT JOIN "question"."question_text" qt 
			ON "qgc"."question_text_id" = "qt"."id"
		WHERE
			"qgc"."question_group_id" = $1
	`
	questionGroupChoiceEntities := []constant.QuestionGroupChoiceEntity{}
	err := postgresRepository.Database.Select(
		&questionGroupChoiceEntities,
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
	groupIndexesQuery := `
		SELECT
			"qgg"."index"
		FROM "question"."question_group_group_member"	qggm
		LEFT JOIN "question"."question_group_group" qgg
			ON "qggm"."question_group_group_id" = "qgg"."id"
		WHERE
			"qggm"."question_group_choice_id" = $1
	`
	questionGroupChoiceDataEntities := []constant.QuestionGroupChoiceDataEntity{}
	for _, questionGroupChoiceEntity := range questionGroupChoiceEntities {
		savedTextEntities := []constant.SavedTextEntity{}

		err := postgresRepository.Database.Select(&savedTextEntities, savedTextQuery, questionGroupChoiceEntity.SavedTextGroupId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		translations := map[string]constant.SavedTextEntity{}
		for _, savedTextEntity := range savedTextEntities {
			translations[savedTextEntity.Language] = savedTextEntity
		}
		if len(translations) == 0 {
			translations = nil
		}
		questionGroupChoiceDataEntity := constant.QuestionGroupChoiceDataEntity{
			QuestionGroupChoiceEntity: &questionGroupChoiceEntity,
			Translations:              translations,
		}

		groupIndexes := []int{}
		err = postgresRepository.Database.Select(&groupIndexes, groupIndexesQuery, questionGroupChoiceEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		questionGroupChoiceDataEntity.GroupIndexes = groupIndexes

		questionGroupChoiceDataEntities = append(questionGroupChoiceDataEntities, questionGroupChoiceDataEntity)
	}

	return questionGroupChoiceDataEntities, nil
}
