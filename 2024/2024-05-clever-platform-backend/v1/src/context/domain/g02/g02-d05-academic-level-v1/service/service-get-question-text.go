package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

type GetQuestionTextInput struct {
	QuestionId int
}

type GetQuestionTextOutput struct {
	QuestionText map[string]*constant.QuestionTextDataEntity
}

func (service *serviceStruct) GetQuestionText(in *GetQuestionTextInput) (*GetQuestionTextOutput, error) {
	textMap := map[string]*constant.QuestionTextDataEntity{
		constant.Command:     nil,
		constant.Description: nil,
		constant.Hint:        nil,
		constant.CorrectText: nil,
		constant.WrongText:   nil,
	}

	for key := range textMap {
		isMainDescription := true
		questionText, err := service.academicLevelStorage.QuestionTextCaseGetByType(in.QuestionId, key, &isMainDescription)
		if err != nil {
			return nil, err
		}
		textMap[key] = questionText

		err = service.GetQuestionTextSpeechUrl(&GetQuestionTextSpeechUrlInput{
			&questionText.Translations,
		})
		if err != nil {
			return nil, err
		}
	}

	return &GetQuestionTextOutput{
		textMap,
	}, nil
}
