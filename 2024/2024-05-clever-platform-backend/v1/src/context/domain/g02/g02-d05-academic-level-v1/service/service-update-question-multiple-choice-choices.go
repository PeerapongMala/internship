package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"mime/multipart"
	"slices"
)

type UpdateQuestionMultipleChoiceChoicesInput struct {
	Tx           *sqlx.Tx
	QuestionId   int
	ChoiceType   string
	TextChoices  []constant.QuestionMultipleChoiceTextChoiceEntity
	ImageChoices []constant.QuestionMultipleChoiceImageChoiceEntity
	ChoiceImages []*multipart.FileHeader
	SubjectId    string
}

type UpdateQuestionMultipleChoiceChoicesOutput struct {
	KeysToDelete []string
	KeysToAdd    map[string]*multipart.FileHeader
}

func (service *serviceStruct) UpdateQuestionMultipleChoiceChoices(in *UpdateQuestionMultipleChoiceChoicesInput) (*UpdateQuestionMultipleChoiceChoicesOutput, error) {
	keysToAdd := map[string]*multipart.FileHeader{}
	originalKeys := []string{}
	keysToDelete := []string{}

	// text choices
	if in.TextChoices != nil {
		// delete all image choices
		imageKeys, err := service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCaseDeleteAll(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}
		keysToDelete = append(keysToDelete, imageKeys...)

		// delete all text choices
		err = service.academicLevelStorage.QuestionMultipleChoiceTextChoiceCaseDeleteAll(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}

		// delete all question text (choice)
		questionTextEntity := constant.QuestionTextEntity{
			QuestionId: in.QuestionId,
			Type:       constant.Choice,
		}
		speechKeys, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(in.Tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}
		keysToDelete = append(keysToDelete, speechKeys...)

		for _, textChoice := range in.TextChoices {
			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: &textChoice.SavedTextGroupId,
				Type:             constant.Choice,
			}
			questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return nil, err
			}

			questionMultipleChoiceTextChoiceEntity := constant.QuestionMultipleChoiceTextChoiceEntity{
				QuestionMultipleChoiceId: in.QuestionId,
				QuestionTextId:           questionText.Id,
				Index:                    textChoice.Index,
				IsCorrect:                textChoice.IsCorrect,
				Point:                    textChoice.Point,
			}
			_, err = service.academicLevelStorage.QuestionMultipleChoiceTextChoiceCreate(in.Tx, &questionMultipleChoiceTextChoiceEntity)
			if err != nil {
				return nil, err
			}
		}
	}

	if in.ImageChoices != nil {
		// delete all text choices
		err := service.academicLevelStorage.QuestionMultipleChoiceTextChoiceCaseDeleteAll(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}

		// delete all image choices
		imageKeys, err := service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCaseDeleteAll(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}

		for i, imageChoice := range in.ImageChoices {
			// case add new choice
			if imageChoice.ImageKey == nil {
				newKey := uuid.NewString()
				if i < len(in.ChoiceImages) && in.ChoiceImages[i] != nil {
					keysToAdd[newKey] = in.ChoiceImages[i]
				}
				imageChoice.ImageKey = &newKey
			} else {
				// case edit choice image
				if i < len(in.ChoiceImages) && in.ChoiceImages[i] != nil {
					newKey := uuid.NewString()
					keysToAdd[newKey] = in.ChoiceImages[i]
					keysToDelete = append(keysToDelete, *imageChoice.ImageKey)
					imageChoice.ImageKey = &newKey

					questionMultipleChoiceImageChoiceEntity := constant.QuestionMultipleChoiceImageChoiceEntity{
						QuestionMultipleChoiceId: in.QuestionId,
						Index:                    imageChoice.Index,
						ImageUrl:                 *imageChoice.ImageKey,
						IsCorrect:                imageChoice.IsCorrect,
						Point:                    imageChoice.Point,
					}
					_, err := service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCreate(in.Tx, &questionMultipleChoiceImageChoiceEntity)
					if err != nil {
						return nil, err
					}
					continue
				}
				originalKeys = append(originalKeys, *imageChoice.ImageKey)
			}

			questionMultipleChoiceImageChoiceEntity := constant.QuestionMultipleChoiceImageChoiceEntity{
				QuestionMultipleChoiceId: in.QuestionId,
				Index:                    imageChoice.Index,
				ImageUrl:                 *imageChoice.ImageKey,
				IsCorrect:                imageChoice.IsCorrect,
				Point:                    imageChoice.Point,
			}
			_, err := service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCreate(in.Tx, &questionMultipleChoiceImageChoiceEntity)
			if err != nil {
				return nil, err
			}
		}

		for _, key := range imageKeys {
			if !slices.Contains(originalKeys, key) {
				keysToDelete = append(keysToDelete, key)
			}
		}
	}

	return &UpdateQuestionMultipleChoiceChoicesOutput{
		KeysToDelete: keysToDelete,
		KeysToAdd:    keysToAdd,
	}, nil
}
