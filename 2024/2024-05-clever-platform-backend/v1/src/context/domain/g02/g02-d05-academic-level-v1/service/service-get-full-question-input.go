package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"

// ==================== Service ==========================

type GetFullQuestionInputInput struct {
	Question constant.QuestionEntity
}

type GetFullQuestionInputOutput struct {
	FullQuestionInput interface{}
}

func (service *serviceStruct) GetFullQuestionInput(in *GetFullQuestionInputInput) (*GetFullQuestionInputOutput, error) {
	question, err := service.academicLevelStorage.QuestionGet(in.Question.Id)
	if err != nil {
		return nil, err
	}

	questionInput, err := service.academicLevelStorage.QuestionInputGet(in.Question.Id)
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

	descriptions, err := service.academicLevelStorage.QuestionInputCaseListDescription(in.Question.Id)
	if err != nil {
		return nil, err
	}
	for i, description := range descriptions {
		if description.SpeechUrl == nil {
			continue
		}
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*description.SpeechUrl)
		if err != nil {
			return nil, err
		}
		descriptions[i].SpeechUrl = url
	}

	return &GetFullQuestionInputOutput{
		constant.FullQuestionInputEntity{
			QuestionEntity:      question,
			QuestionInputEntity: questionInput,
			Command:             getQuestionTextOutput.QuestionText[constant.Command],
			Description:         getQuestionTextOutput.QuestionText[constant.Description],
			Hint:                getQuestionTextOutput.QuestionText[constant.Hint],
			CorrectText:         getQuestionTextOutput.QuestionText[constant.CorrectText],
			WrongText:           getQuestionTextOutput.QuestionText[constant.WrongText],
			Descriptions:        descriptions,
		},
	}, nil
}
