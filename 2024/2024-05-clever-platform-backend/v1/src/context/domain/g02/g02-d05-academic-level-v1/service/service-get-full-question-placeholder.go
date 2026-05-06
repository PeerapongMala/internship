package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

// ==================== Service ==========================

type GetFullQuestionPlaceholderInput struct {
	Question constant.QuestionEntity
}

type GetFullQuestionPlaceholderOutput struct {
	FullQuestionPlaceholder interface{}
}

func (service *serviceStruct) GetFullQuestionPlaceholder(in *GetFullQuestionPlaceholderInput) (*GetFullQuestionPlaceholderOutput, error) {
	question, err := service.academicLevelStorage.QuestionGet(in.Question.Id)
	if err != nil {
		return nil, err
	}

	questionPlaceholder, err := service.academicLevelStorage.QuestionPlaceholderGet(in.Question.Id)
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

	savedDescriptions, err := service.academicLevelStorage.QuestionPlaceholderDescriptionCaseListByQuestion(in.Question.Id)
	if err != nil {
		return nil, err
	}
	for i, description := range savedDescriptions {
		if description.SpeechUrl == nil {
			continue
		}
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*description.SpeechUrl)
		if err != nil {
			return nil, err
		}
		savedDescriptions[i].SpeechUrl = url
	}

	choices, err := service.academicLevelStorage.QuestionPlaceholderChoiceCaseListByQuestion(in.Question.Id)
	if err != nil {
		return nil, err
	}
	for i, choice := range choices {
		if choice.SpeechUrl == nil {
			continue
		}
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*choice.SpeechUrl)
		if err != nil {
			return nil, err
		}
		choices[i].SpeechUrl = url
	}

	return &GetFullQuestionPlaceholderOutput{
		constant.FullQuestionPlaceholderEntity{
			QuestionEntity:            question,
			QuestionPlaceholderEntity: questionPlaceholder,
			Command:                   getQuestionTextOutput.QuestionText[constant.Command],
			Description:               getQuestionTextOutput.QuestionText[constant.Description],
			Hint:                      getQuestionTextOutput.QuestionText[constant.Hint],
			CorrectText:               getQuestionTextOutput.QuestionText[constant.CorrectText],
			WrongText:                 getQuestionTextOutput.QuestionText[constant.WrongText],
			Descriptions:              savedDescriptions,
			TextChoices:               choices,
		},
	}, nil
}
