package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
)

type UpdateQuestionSortTextChoicesInput struct {
	Tx          *sqlx.Tx
	TextChoices []constant.QuestionSortTextChoiceEntity
	QuestionId  int
}

type UpdateQuestionSortTextChoicesOutput struct {
	KeysToDelete []string
}

func (service *serviceStruct) UpdateQuestionSortTextChoices(in *UpdateQuestionSortTextChoicesInput) (*UpdateQuestionSortTextChoicesOutput, error) {
	keysToDelete := []string{}

	if in.TextChoices != nil {
		err := service.academicLevelStorage.QuestionSortAnswerCaseDeleteByQuestionId(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}

		err = service.academicLevelStorage.QuestionSortTextChoiceCaseDeleteByQuestionId(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}

		questionTextEntity := constant.QuestionTextEntity{
			QuestionId: in.QuestionId,
			Type:       constant.Choice,
		}

		speechKeys, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(in.Tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}
		keysToDelete = append(keysToDelete, speechKeys...)

		for _, textChoice := range in.TextChoices {
			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: &textChoice.SavedTextGroupId,
				Type:             constant.Choice,
			}
			questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return nil, err
			}

			questionSortTextChoiceEntity := constant.QuestionSortTextChoiceEntity{
				QuestionSortId: in.QuestionId,
				QuestionTextId: questionText.Id,
				Index:          textChoice.Index,
				IsCorrect:      textChoice.IsCorrect,
			}
			questionSortTextChoice, err := service.academicLevelStorage.QuestionSortTextChoiceCreate(in.Tx, &questionSortTextChoiceEntity)
			if err != nil {
				return nil, err
			}

			for _, answerIndex := range textChoice.AnswerIndexes {
				questionSortAnswerEntity := constant.QuestionSortAnswerEntity{
					QuestionSortId:           in.QuestionId,
					QuestionSortTextChoiceId: questionSortTextChoice.Id,
					Index:                    answerIndex,
				}
				_, err := service.academicLevelStorage.QuestionSortAnswerCreate(in.Tx, &questionSortAnswerEntity)
				if err != nil {
					return nil, err
				}
			}
		}
	}

	return &UpdateQuestionSortTextChoicesOutput{
		KeysToDelete: keysToDelete,
	}, nil
}
