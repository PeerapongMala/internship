package service

import (
	"sort"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

// ==================== Service ==========================

type GetFullQuestionGroupInput struct {
	Question constant.QuestionEntity
}

type GetFullQuestionGroupOutput struct {
	FullQuestionGroup interface{}
}

func (service *serviceStruct) GetFullQuestionGroup(in *GetFullQuestionGroupInput) (*GetFullQuestionGroupOutput, error) {
	question, err := service.academicLevelStorage.QuestionGet(in.Question.Id)
	if err != nil {
		return nil, err
	}

	questionGroup, err := service.academicLevelStorage.QuestionGroupGet(in.Question.Id)
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

	groups, err := service.academicLevelStorage.QuestionGroupGroupCaseListByQuestion(nil, in.Question.Id)
	if err != nil {
		return nil, err
	}
	sort.Slice(groups, func(i, j int) bool {
		return groups[i].Index < groups[j].Index
	})
	for _, group := range groups {
		err := service.GetQuestionTextSpeechUrl(&GetQuestionTextSpeechUrlInput{
			&group.Translations,
		})
		if err != nil {
			return nil, err
		}
	}

	choices, err := service.academicLevelStorage.QuestionGroupChoiceCaseListByQuestion(in.Question.Id)
	if err != nil {
		return nil, err
	}
	for _, choice := range choices {
		if choice.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*choice.ImageUrl)
			if err != nil {
				return nil, err
			}
			choice.ImageKey = choice.ImageUrl
			choice.ImageUrl = url
		} else {
			err = service.GetQuestionTextSpeechUrl(&GetQuestionTextSpeechUrlInput{
				Translations: &choice.Translations,
			})
			if err != nil {
				return nil, err
			}
		}
	}

	textChoices := []constant.QuestionGroupChoiceDataEntity{}
	imageChoices := []constant.QuestionGroupChoiceDataEntity{}
	if questionGroup.ChoiceType == constant.QuestionChoiceTypeImage {
		imageChoices = choices
	} else {
		textChoices = choices
	}

	return &GetFullQuestionGroupOutput{
		constant.FullQuestionGroupSeparateChoiceTypeEntity{
			QuestionEntity:      question,
			QuestionGroupEntity: questionGroup,
			Command:             getQuestionTextOutput.QuestionText[constant.Command],
			Description:         getQuestionTextOutput.QuestionText[constant.Description],
			Hint:                getQuestionTextOutput.QuestionText[constant.Hint],
			CorrectText:         getQuestionTextOutput.QuestionText[constant.CorrectText],
			WrongText:           getQuestionTextOutput.QuestionText[constant.WrongText],
			TextChoices:         textChoices,
			ImageChoices:        imageChoices,
			Groups:              groups,
		},
	}, nil
}
