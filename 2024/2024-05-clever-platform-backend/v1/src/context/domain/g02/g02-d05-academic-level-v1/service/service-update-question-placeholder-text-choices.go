package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"time"
)

type UpdateQuestionPlaceholderTextChoicesInput struct {
	Tx                *sqlx.Tx
	CurriculumGroupId int
	TextChoices       []constant.QuestionPlaceholderTextChoiceEntity
	QuestionId        int
	SubjectId         string
}

type UpdateQuestionPlaceholderTextChoicesOutput struct {
	KeysToDelete []string
}

func (service *serviceStruct) UpdateQuestionPlaceholderTextChoices(in *UpdateQuestionPlaceholderTextChoicesInput) (*UpdateQuestionPlaceholderTextChoicesOutput, error) {
	keysToDelete := []string{}

	subjectLanguage, err := service.academicLevelStorage.QuestionCaseGetSubjectLanguage(in.QuestionId)
	if err != nil {
		return nil, err
	}
	if subjectLanguage == nil {
		defaultLanguage := constant.Thai
		subjectLanguage = &defaultLanguage
	}

	// text choices
	if len(in.TextChoices) > 0 {
		err := service.academicLevelStorage.QuestionPlaceholderTextChoiceCaseDeleteByQuestion(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}

		speechKeys, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(in.Tx, &constant.QuestionTextEntity{
			QuestionId: in.QuestionId,
			Type:       constant.Choice,
		})
		if err != nil {
			return nil, err
		}
		keysToDelete = append(keysToDelete, speechKeys...)

		for _, textChoice := range in.TextChoices {
			speechKey := uuid.NewString()
			bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(textChoice.Text, *subjectLanguage)
			if err != nil {
				return nil, err
			}

			err = service.cloudStorage.ObjectCreate(bytes, speechKey, constant.Speech)
			if err != nil {
				return nil, err
			}

			groupId := uuid.NewString()
			savedTextEntity := constant.SavedTextEntity{
				CurriculumGroupId: in.CurriculumGroupId,
				GroupId:           groupId,
				Language:          *subjectLanguage,
				Text:              &textChoice.Text,
				SpeechUrl:         &speechKey,
				Status:            constant.SavedTextHidden,
				CreatedAt:         time.Now().UTC(),
				CreatedBy:         in.SubjectId,
			}
			savedText, err := service.academicLevelStorage.SavedTextCreate(in.Tx, &savedTextEntity)
			if err != nil {
				return nil, err
			}

			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: &savedText.GroupId,
				Type:             constant.Choice,
			}
			questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return nil, err
			}

			questionPlaceholderTextChoiceEntity := constant.QuestionPlaceholderTextChoiceEntity{
				QuestionPlaceholderId: in.QuestionId,
				QuestionTextId:        questionText.Id,
				Index:                 textChoice.Index,
				IsCorrect:             textChoice.IsCorrect,
			}
			_, err = service.academicLevelStorage.QuestionPlaceholderTextChoiceCreate(in.Tx, &questionPlaceholderTextChoiceEntity)
			if err != nil {
				return nil, err
			}
		}
	}

	return &UpdateQuestionPlaceholderTextChoicesOutput{
		KeysToDelete: keysToDelete,
	}, nil
}
