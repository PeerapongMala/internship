package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
)

type CreateQuestionGroupGroupInput struct {
	Tx         *sqlx.Tx
	QuestionId int
	Groups     []constant.QuestionGroupGroupEntity
}

type CreateQuestionGroupGroupOutput struct {
	Groups []constant.QuestionGroupGroupEntity
}

func (service *serviceStruct) CreateQuestionGroupGroups(in *CreateQuestionGroupGroupInput) (*CreateQuestionGroupGroupOutput, error) {
	for i, group := range in.Groups {
		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       in.QuestionId,
			SavedTextGroupId: &group.SavedTextGroupId,
			Type:             constant.GroupName,
		}

		questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}

		group.QuestionGroupId = in.QuestionId
		group.QuestionTextId = questionText.Id
		questionGroupGroup, err := service.academicLevelStorage.QuestionGroupGroupCreate(in.Tx, &group)
		if err != nil {
			return nil, err
		}
		in.Groups[i] = *questionGroupGroup
	}

	return &CreateQuestionGroupGroupOutput{
		in.Groups,
	}, nil
}
