package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"regexp"
	"strings"
	"time"
)

type CreateQuestionInputDescriptionsInput struct {
	Tx                *sqlx.Tx
	CurriculumGroupId int
	SubjectLanguage   string
	QuestionId        int
	Descriptions      []constant.QuestionInputDescriptionEntity
	SubjectId         string
}

func (service *serviceStruct) CreateQuestionInputDescriptions(in *CreateQuestionInputDescriptionsInput) error {
	pattern := `\{Ans\d+\}`

	for _, description := range in.Descriptions {
		regex, err := regexp.Compile(pattern)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		answers := regex.FindAllString(description.Text, -1)
		descriptionTextToSpeech := description.Text

		for i, answer := range answers {
			destString := ""
			if i < len(description.Answers) {
				if len(description.Answers[i].Text) >= 1 {
					destString = description.Answers[i].Text[0].Text
				}
			}
			descriptionTextToSpeech = strings.Replace(descriptionTextToSpeech, answer, destString, 1)
		}

		bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(descriptionTextToSpeech, in.SubjectLanguage)
		if err != nil {
			return err
		}

		speechKey := uuid.NewString()
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
			Type:             constant.Description,
			Index:            &description.Index,
		}
		descriptionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
		if err != nil {
			return err
		}

		for _, answer := range description.Answers {
			questionInputAnswerEntity := constant.QuestionInputAnswerEntity{
				QuestionTextDescriptionId: descriptionText.Id,
				AnswerIndex:               answer.Index,
				Type:                      &answer.Type,
			}

			questionInputAnswer, err := service.academicLevelStorage.QuestionInputAnswerCreate(in.Tx, &questionInputAnswerEntity)
			if err != nil {
				return err
			}

			for _, text := range answer.Text {
				groupId := uuid.NewString()
				savedTextGroupEntity := constant.SavedTextEntity{
					CurriculumGroupId: in.CurriculumGroupId,
					GroupId:           groupId,
					Language:          in.SubjectLanguage,
					Text:              &text.Text,
					Status:            constant.SavedTextHidden,
					CreatedAt:         time.Now().UTC(),
					CreatedBy:         in.SubjectId,
				}
				savedTextGroup, err := service.academicLevelStorage.SavedTextCreate(in.Tx, &savedTextGroupEntity)
				if err != nil {
					return err
				}

				questionTextEntity := constant.QuestionTextEntity{
					QuestionId:       in.QuestionId,
					SavedTextGroupId: &savedTextGroup.GroupId,
					Type:             constant.Choice,
				}
				savedQuestionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
				if err != nil {
					return err
				}

				questionInputAnswerTextEntity := constant.QuestionInputAnswerTextEntity{
					QuestionInputAnswerId: questionInputAnswer.Id,
					QuestionTextId:        savedQuestionText.Id,
					Index:                 text.Index,
				}
				_, err = service.academicLevelStorage.QuestionInputAnswerTextCreate(in.Tx, &questionInputAnswerTextEntity)
				if err != nil {
					return err
				}
			}
		}

	}

	return nil
}
