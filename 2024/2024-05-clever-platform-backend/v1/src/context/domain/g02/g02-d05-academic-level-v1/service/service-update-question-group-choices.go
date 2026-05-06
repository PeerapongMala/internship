package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"mime/multipart"
	"net/http"
	"slices"
)

type UpdateQuestionGroupChoicesInput struct {
	Tx           *sqlx.Tx
	TextChoices  []constant.QuestionGroupChoiceEntity
	ImageChoices []constant.QuestionGroupChoiceEntity
	ChoiceImages []*multipart.FileHeader
	Groups       []constant.QuestionGroupGroupDataEntity
	QuestionId   int
}

type UpdateQuestionGroupChoicesOutput struct {
	KeysToDelete []string
	KeysToAdd    map[string]*multipart.FileHeader
}

func (service *serviceStruct) UpdateQuestionGroupChoices(in *UpdateQuestionGroupChoicesInput) (*UpdateQuestionGroupChoicesOutput, error) {
	keysToDelete := []string{}
	keysToAdd := map[string]*multipart.FileHeader{}
	originalKeys := []string{}

	//  choices
	// imageKeys := []string{}
	if len(append(in.TextChoices, in.ImageChoices...)) > 0 {
		choices, err := service.academicLevelStorage.QuestionGroupChoiceCaseListByQuestion(in.QuestionId)
		if err != nil {
			return nil, err
		}

		for _, choice := range choices {
			err = service.academicLevelStorage.QuestionGroupGroupMemberCaseDeleteByQuestionGroupChoiceId(in.Tx, choice.Id)
			if err != nil {
				return nil, err
			}
		}

		imageKeys, err := service.academicLevelStorage.QuestionGroupChoiceCaseDeleteByQuestionId(in.Tx, in.QuestionId)
		if err != nil {
			return nil, err
		}

		questionTextEntity := constant.QuestionTextEntity{
			QuestionId: in.QuestionId,
			Type:       constant.Choice,
		}
		_, err = service.academicLevelStorage.QuestionTextCaseDeleteByType(in.Tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}

		for i, imageChoice := range in.ImageChoices {
			if len(in.ChoiceImages) <= i {
				msg := "Invalid image choices"
				err := helper.NewHttpError(http.StatusBadRequest, &msg)
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

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

					// add choice
					questionGroupChoiceEntity := constant.QuestionGroupChoiceEntity{
						QuestionGroupId: in.QuestionId,
						Index:           imageChoice.Index,
						ImageUrl:        imageChoice.ImageKey,
						IsCorrect:       imageChoice.IsCorrect,
					}
					questionGroupChoice, err := service.academicLevelStorage.QuestionGroupChoiceCreate(in.Tx, &questionGroupChoiceEntity)
					if err != nil {
						return nil, err
					}

					// add member
					for _, groupIndex := range imageChoice.GroupIndexes {
						for i, group := range in.Groups {
							if group.Index == groupIndex {
								questionGroupGroupMemberEntity := constant.QuestionGroupGroupMemberEntity{
									QuestionGroupGroupId:  group.Id,
									QuestionGroupChoiceId: questionGroupChoice.Id,
								}
								_, err := service.academicLevelStorage.QuestionGroupGroupMemberCreate(in.Tx, &questionGroupGroupMemberEntity)
								if err != nil {
									return nil, err
								}
								break
							}

							if i == len(in.Groups)-1 {
								msg := fmt.Sprintf(`Group index %d doesn't exist`, groupIndex)
								err := helper.NewHttpError(http.StatusBadRequest, &msg)
								log.Printf("%+v", errors.WithStack(err))
								return nil, err
							}
						}
					}
					continue
				}
				originalKeys = append(originalKeys, *imageChoice.ImageKey)
			}

			// add choice
			questionGroupChoiceEntity := constant.QuestionGroupChoiceEntity{
				QuestionGroupId: in.QuestionId,
				Index:           imageChoice.Index,
				ImageUrl:        imageChoice.ImageKey,
				IsCorrect:       imageChoice.IsCorrect,
			}
			questionGroupChoice, err := service.academicLevelStorage.QuestionGroupChoiceCreate(in.Tx, &questionGroupChoiceEntity)
			if err != nil {
				return nil, err
			}

			// add member
			for _, groupIndex := range imageChoice.GroupIndexes {
				for i, group := range in.Groups {
					if group.Index == groupIndex {
						questionGroupGroupMemberEntity := constant.QuestionGroupGroupMemberEntity{
							QuestionGroupGroupId:  group.Id,
							QuestionGroupChoiceId: questionGroupChoice.Id,
						}
						_, err := service.academicLevelStorage.QuestionGroupGroupMemberCreate(in.Tx, &questionGroupGroupMemberEntity)
						if err != nil {
							return nil, err
						}
						break
					}

					if i == len(in.Groups)-1 {
						msg := fmt.Sprintf(`Group index %d doesn't exist`, groupIndex)
						err := helper.NewHttpError(http.StatusBadRequest, &msg)
						log.Printf("%+v", errors.WithStack(err))
						return nil, err
					}
				}
			}
		}

		for _, key := range imageKeys {
			if !slices.Contains(originalKeys, key) {
				keysToDelete = append(keysToDelete, key)
			}
		}

		for _, textChoice := range in.TextChoices {
			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: textChoice.SavedTextGroupId,
				Type:             constant.Choice,
			}
			questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return nil, err
			}

			textChoice.QuestionGroupId = in.QuestionId
			textChoice.QuestionTextId = &questionText.Id
			questionGroupChoice, err := service.academicLevelStorage.QuestionGroupChoiceCreate(in.Tx, &textChoice)
			if err != nil {
				return nil, err
			}

			for _, groupIndex := range textChoice.GroupIndexes {
				for i, group := range in.Groups {
					if group.Index == groupIndex {
						questionGroupGroupMemberEntity := constant.QuestionGroupGroupMemberEntity{
							QuestionGroupGroupId:  group.Id,
							QuestionGroupChoiceId: questionGroupChoice.Id,
						}
						_, err := service.academicLevelStorage.QuestionGroupGroupMemberCreate(in.Tx, &questionGroupGroupMemberEntity)
						if err != nil {
							return nil, err
						}
						break
					}

					if i == len(in.Groups)-1 {
						msg := fmt.Sprintf(`Group index %d doesn't exist`, groupIndex)
						err := helper.NewHttpError(http.StatusBadRequest, &msg)
						log.Printf("%+v", errors.WithStack(err))
						return nil, err
					}
				}
			}
		}
	}

	return &UpdateQuestionGroupChoicesOutput{
		KeysToDelete: keysToDelete,
		KeysToAdd:    keysToAdd,
	}, nil
}
