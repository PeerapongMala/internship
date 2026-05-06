package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"time"
)

type CreateQuestionPlaceholderDescriptionsInput struct {
	Tx                *sqlx.Tx
	CurriculumGroupId int
	QuestionId        int
	SubjectLanguage   string
	Descriptions      []constant.QuestionPlaceholderDescriptionEntity
	SubjectId         string
}

func (service *serviceStruct) CreateQuestionPlaceholderDescriptions(in *CreateQuestionPlaceholderDescriptionsInput) error {
	descriptions := map[int]int{}
	for _, description := range in.Descriptions {
		speechKey := uuid.NewString()
		bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(description.Text, in.SubjectLanguage)
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
			Text:              &description.Text,
			SpeechUrl:         &speechKey,
			Status:            constant.SavedTextHidden,
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
			Type:             constant.Description,
			Index:            &description.Index,
		}
		descriptionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
		if err != nil {
			return err
		}
		descriptions[description.Index] = descriptionText.Id

		for _, answer := range description.Answers {
			questionPlaceholderAnswerEntity := constant.QuestionPlaceholderAnswerEntity{
				QuestionTextDescriptionId: descriptionText.Id,
				AnswerIndex:               answer.Index,
			}

			questionPlaceholderAnswer, err := service.academicLevelStorage.QuestionPlaceholderAnswerCreate(in.Tx, &questionPlaceholderAnswerEntity)
			if err != nil {
				return err
			}

			for _, choice := range answer.Text {
				questionPlaceholderAnswerTextEntity := constant.QuestionPlaceholderAnswerTextEntity{
					QuestionPlaceholderAnswerId: questionPlaceholderAnswer.Id,
					ChoiceIndex:                 choice.ChoiceIndex,
					Index:                       choice.Index,
				}

				_, err := service.academicLevelStorage.QuestionPlaceholderAnswerTextCreate(in.Tx, &questionPlaceholderAnswerTextEntity)
				if err != nil {
					return err
				}
			}
		}
	}

	return nil
}
