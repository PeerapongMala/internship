package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

// ==================== Service ==========================

type GetFullQuestionLearnInput struct {
	Question constant.QuestionEntity
}

type GetFullQuestionLearnOutput struct {
	FullQuestionLearn interface{}
}

func (service *serviceStruct) GetFullQuestionLearn(in *GetFullQuestionLearnInput) (*GetFullQuestionLearnOutput, error) {
	question, err := service.academicLevelStorage.QuestionGet(in.Question.Id)
	if err != nil {
		return nil, err
	}

	questionLearn, err := service.academicLevelStorage.QuestionLearnGet(in.Question.Id)
	if err != nil {
		return nil, err
	}

	getQuestionTextOutput, err := service.GetQuestionText(&GetQuestionTextInput{
		in.Question.Id,
	})
	if err != nil {
		return nil, err
	}

	return &GetFullQuestionLearnOutput{
		constant.FullQuestionLearnEntity{
			QuestionEntity:      question,
			QuestionLearnEntity: questionLearn,
			Command:             getQuestionTextOutput.QuestionText[constant.Command],
		},
	}, nil
}
