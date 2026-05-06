package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"time"
)

type UpdateQuestionPlaceholderDescriptionsInput struct {
	Tx                *sqlx.Tx
	CurriculumGroupId int
	Descriptions      []constant.QuestionPlaceholderDescriptionEntity
	QuestionId        int
	SubjectId         string
}

type UpdateQuestionPlaceholderDescriptionsOutput struct {
	KeysToDelete []string
}

func (service *serviceStruct) UpdateQuestionPlaceholderDescriptions(in *UpdateQuestionPlaceholderDescriptionsInput) (*UpdateQuestionPlaceholderDescriptionsOutput, error) {
	keysToDelete := []string{}

	subjectLanguage, err := service.academicLevelStorage.QuestionCaseGetSubjectLanguage(in.QuestionId)
	if err != nil {
		return nil, err
	}
	if subjectLanguage == nil {
		defaultLanguage := constant.Thai
		subjectLanguage = &defaultLanguage
	}

	// descriptions
	if len(in.Descriptions) > 0 {
		speechKeys, err := service.academicLevelStorage.QuestionPlaceholderCaseDeleteDescription(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}
		keysToDelete = append(keysToDelete, speechKeys...)

		for _, description := range in.Descriptions {
			//speechKey := uuid.NewString()
			//bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(description.Text, *subjectLanguage)
			//if err != nil {
			//	return nil, err
			//}
			//
			//start := time.Now()
			//err = service.cloudStorage.ObjectCreate(bytes, speechKey, constant.Speech)
			//if err != nil {
			//	return nil, err
			//}
			//log.Println(time.Since(start))

			groupId := uuid.NewString()
			savedTextEntity := constant.SavedTextEntity{
				CurriculumGroupId: in.CurriculumGroupId,
				GroupId:           groupId,
				Language:          *subjectLanguage,
				//SpeechUrl:         &speechKey,
				Text:      &description.Text,
				Status:    "hidden",
				CreatedAt: time.Now().UTC(),
				CreatedBy: in.SubjectId,
			}
			savedText, err := service.academicLevelStorage.SavedTextCreate(in.Tx, &savedTextEntity)
			if err != nil {
				return nil, err
			}

			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: &savedText.GroupId,
				Type:             constant.Description,
				Index:            &description.Index,
			}
			descriptionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return nil, err
			}

			for _, answer := range description.Answers {
				questionPlaceholderAnswerEntity := constant.QuestionPlaceholderAnswerEntity{
					QuestionTextDescriptionId: descriptionText.Id,
					AnswerIndex:               answer.Index,
				}

				questionPlaceholderAnswer, err := service.academicLevelStorage.QuestionPlaceholderAnswerCreate(in.Tx, &questionPlaceholderAnswerEntity)
				if err != nil {
					return nil, err
				}

				for _, choice := range answer.Text {
					questionPlaceholderAnswerTextEntity := constant.QuestionPlaceholderAnswerTextEntity{
						QuestionPlaceholderAnswerId: questionPlaceholderAnswer.Id,
						ChoiceIndex:                 choice.ChoiceIndex,
						Index:                       choice.Index,
					}

					_, err := service.academicLevelStorage.QuestionPlaceholderAnswerTextCreate(in.Tx, &questionPlaceholderAnswerTextEntity)
					if err != nil {
						return nil, err
					}
				}
			}
		}
	}

	return &UpdateQuestionPlaceholderDescriptionsOutput{KeysToDelete: keysToDelete}, nil
}
