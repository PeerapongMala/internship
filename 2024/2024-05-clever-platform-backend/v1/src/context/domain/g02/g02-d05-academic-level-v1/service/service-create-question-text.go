package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
)

type CreateQuestionTextInput struct {
	Tx         *sqlx.Tx
	QuestionId int
	TextMap    map[string]*string
}

func (service *serviceStruct) CreateQuestionText(in *CreateQuestionTextInput) error {
	for textType, text := range in.TextMap {
		if text != nil {
			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: text,
				Type:             textType,
			}
			_, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
