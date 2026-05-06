package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

// ==================== Service ==========================

type GetFullQuestionSortInput struct {
	Question constant.QuestionEntity
}

type GetFullQuestionSortOutput struct {
	FullQuestionSort interface{}
}

func (service *serviceStruct) GetFullQuestionSort(in *GetFullQuestionSortInput) (*GetFullQuestionSortOutput, error) {
	question, err := service.academicLevelStorage.QuestionGet(in.Question.Id)
	if err != nil {
		return nil, err
	}

	questionSort, err := service.academicLevelStorage.QuestionSortGet(in.Question.Id)
	if err != nil {
		return nil, err
	}

	if question.ImageDescriptionUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*question.ImageDescriptionUrl)
		if err != nil {
			return nil, err
		}
		question.ImageDescriptionUrl = url
	}

	if question.ImageHintUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*question.ImageHintUrl)
		if err != nil {
			return nil, err
		}
		question.ImageHintUrl = url
	}

	getQuestionTextOutput, err := service.GetQuestionText(&GetQuestionTextInput{
		in.Question.Id,
	})
	if err != nil {
		return nil, err
	}

	textChoices, err := service.academicLevelStorage.QuestionSortTextChoiceCaseListByQuestion(in.Question.Id)
	if err != nil {
		return nil, err
	}
	for _, textChoice := range textChoices {
		err := service.GetQuestionTextSpeechUrl(&GetQuestionTextSpeechUrlInput{
			&textChoice.Translations,
		})
		if err != nil {
			return nil, err
		}
	}

	return &GetFullQuestionSortOutput{
		constant.FullQuestionSortEntity{
			QuestionEntity:     question,
			QuestionSortEntity: questionSort,
			Command:            getQuestionTextOutput.QuestionText[constant.Command],
			Description:        getQuestionTextOutput.QuestionText[constant.Description],
			Hint:               getQuestionTextOutput.QuestionText[constant.Hint],
			CorrectText:        getQuestionTextOutput.QuestionText[constant.CorrectText],
			WrongText:          getQuestionTextOutput.QuestionText[constant.WrongText],
			TextChoices:        textChoices,
		},
	}, nil
}
