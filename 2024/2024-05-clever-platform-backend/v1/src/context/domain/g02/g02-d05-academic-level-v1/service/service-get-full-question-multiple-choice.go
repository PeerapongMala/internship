package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

// ==================== Service ==========================

type GetFullQuestionMultipleChoiceInput struct {
	Question constant.QuestionEntity
}

type GetFullQuestionMultipleChoiceOutput struct {
	FullQuestionMultipleChoice interface{}
}

func (service *serviceStruct) GetFullQuestionMultipleChoice(in *GetFullQuestionMultipleChoiceInput) (*GetFullQuestionMultipleChoiceOutput, error) {
	question, err := service.academicLevelStorage.QuestionGet(in.Question.Id)
	if err != nil {
		return nil, err
	}

	questionMultipleChoice, err := service.academicLevelStorage.QuestionMultipleChoiceGet(in.Question.Id)
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

	textChoices, err := service.academicLevelStorage.QuestionMultipleChoiceTextChoiceCaseListByQuestion(in.Question.Id)
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

	imageChoices, err := service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCaseListByQuestion(in.Question.Id)
	if err != nil {
		return nil, err
	}

	for i, imagesChoice := range imageChoices {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(imagesChoice.ImageUrl)
		if err != nil {
			return nil, err
		}
		imageChoices[i].ImageKey = &imagesChoice.ImageUrl
		imageChoices[i].ImageUrl = *url
	}

	return &GetFullQuestionMultipleChoiceOutput{
		constant.FullQuestionMultipleChoiceEntity{
			QuestionEntity:               question,
			QuestionMultipleChoiceEntity: questionMultipleChoice,
			Command:                      getQuestionTextOutput.QuestionText[constant.Command],
			Description:                  getQuestionTextOutput.QuestionText[constant.Description],
			Hint:                         getQuestionTextOutput.QuestionText[constant.Hint],
			CorrectText:                  getQuestionTextOutput.QuestionText[constant.CorrectText],
			WrongText:                    getQuestionTextOutput.QuestionText[constant.WrongText],
			TextChoices:                  textChoices,
			ImageChoices:                 imageChoices,
		},
	}, nil
}
