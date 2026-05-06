package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
)

// ==================== Service ==========================

type UpdateQuestionTextInput struct {
	Tx         *sqlx.Tx
	QuestionId int
	TextMap    map[string]*string
}

type UpdateQuestionTextOutput struct {
	KeysToDelete []string
}

func (service *serviceStruct) UpdateQuestionText(in *UpdateQuestionTextInput) (*UpdateQuestionTextOutput, error) {
	keysToDelete := []string{}
	for textType, text := range in.TextMap {
		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       in.QuestionId,
			SavedTextGroupId: text,
			Type:             textType,
		}
		speechKeys, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(in.Tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}
		keysToDelete = append(keysToDelete, speechKeys...)

		if text != nil {
			_, err = service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return nil, err
			}
		}
	}

	return &UpdateQuestionTextOutput{
		KeysToDelete: keysToDelete,
	}, nil
}
