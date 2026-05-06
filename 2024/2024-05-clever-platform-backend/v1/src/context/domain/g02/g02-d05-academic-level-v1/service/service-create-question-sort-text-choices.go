package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
)

type CreateQuestionSortTextChoicesInput struct {
	Tx          *sqlx.Tx
	QuestionId  int
	TextChoices []constant.QuestionSortTextChoiceEntity
}

func (service *serviceStruct) CreateQuestionSortTextChoices(in *CreateQuestionSortTextChoicesInput) error {
	for _, textChoice := range in.TextChoices {
		textChoice.QuestionSortId = in.QuestionId

		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       in.QuestionId,
			SavedTextGroupId: &textChoice.SavedTextGroupId,
			Type:             constant.Choice,
		}
		questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
		if err != nil {
			return err
		}
		textChoice.QuestionTextId = questionText.Id

		questionSortTextChoice, err := service.academicLevelStorage.QuestionSortTextChoiceCreate(in.Tx, &textChoice)
		if err != nil {
			return err
		}
		if textChoice.AnswerIndexes == nil {
			textChoice.AnswerIndexes = []int{}
		}
		// questionSortTextChoice.AnswerIndexes = textChoice.AnswerIndexes

		for _, answerIndex := range textChoice.AnswerIndexes {
			questionSortAnswerEntity := constant.QuestionSortAnswerEntity{
				QuestionSortId:           in.QuestionId,
				QuestionSortTextChoiceId: questionSortTextChoice.Id,
				Index:                    answerIndex,
			}
			_, err := service.academicLevelStorage.QuestionSortAnswerCreate(in.Tx, &questionSortAnswerEntity)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
