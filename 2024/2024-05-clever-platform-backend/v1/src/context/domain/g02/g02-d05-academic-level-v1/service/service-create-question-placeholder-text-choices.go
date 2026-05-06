package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"time"
)

type CreateQuestionPlaceholderTextChoicesInput struct {
	Tx                *sqlx.Tx
	CurriculumGroupId int
	QuestionId        int
	SubjectLanguage   string
	TextChoices       []constant.QuestionPlaceholderTextChoiceEntity
	SubjectId         string
}

func (service *serviceStruct) CreateQuestionPlaceholderTextChoices(in *CreateQuestionPlaceholderTextChoicesInput) error {
	for _, textChoice := range in.TextChoices {
		speechKey := uuid.NewString()
		bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(textChoice.Text, in.SubjectLanguage)
		if err != nil {
			return err
		}

		err = service.cloudStorage.ObjectCreate(bytes, speechKey, constant.Speech)
		if err != nil {
			return err
		}

		groupId := uuid.NewString()
		savedTextEntity := constant.SavedTextEntity{
			CurriculumGroupId: in.CurriculumGroupId,
			GroupId:           groupId,
			Language:          in.SubjectLanguage,
			Text:              &textChoice.Text,
			Status:            constant.SavedTextHidden,
			SpeechUrl:         &speechKey,
			CreatedAt:         time.Now().UTC(),
			CreatedBy:         in.SubjectId,
		}
		savedText, err := service.academicLevelStorage.SavedTextCreate(in.Tx, &savedTextEntity)
		if err != nil {
			return err
		}

		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       in.QuestionId,
			SavedTextGroupId: &savedText.GroupId,
			Type:             constant.Choice,
		}
		questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
		if err != nil {
			return err
		}

		questionPlaceholderTextChoiceEntity := constant.QuestionPlaceholderTextChoiceEntity{
			QuestionPlaceholderId: in.QuestionId,
			QuestionTextId:        questionText.Id,
			Index:                 textChoice.Index,
			IsCorrect:             textChoice.IsCorrect,
		}
		_, err = service.academicLevelStorage.QuestionPlaceholderTextChoiceCreate(in.Tx, &questionPlaceholderTextChoiceEntity)
		if err != nil {
			return err
		}
	}

	return nil
}
