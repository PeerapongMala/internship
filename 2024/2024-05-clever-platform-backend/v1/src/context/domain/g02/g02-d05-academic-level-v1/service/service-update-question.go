package service

import (
	cloudStorageInstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"mime/multipart"
)

type UpdateQuestionInput struct {
	Tx               *sqlx.Tx
	Question         constant.QuestionEntity
	DescriptionImage *multipart.FileHeader
	HintImage        *multipart.FileHeader
}

type UpdateQuestionOutput struct {
	Question     constant.QuestionEntity
	KeysToDelete []string
}

func (service *serviceStruct) UpdateQuestion(in *UpdateQuestionInput) (*UpdateQuestionOutput, error) {
	keysToDelete := []string{}
	if in.Question.DeleteDescriptionImage {
		keysToDelete = append(keysToDelete, helper.Deref(in.Question.ImageDescriptionUrl))
	}
	if in.Question.DeleteHintImage {
		keysToDelete = append(keysToDelete, helper.Deref(in.Question.ImageHintUrl))
	}

	if in.DescriptionImage != nil {
		if in.Question.ImageDescriptionUrl != nil {
			keysToDelete = append(keysToDelete, *in.Question.ImageDescriptionUrl)
		}
		newKey := uuid.NewString()
		err := service.cloudStorage.ObjectCreate(in.DescriptionImage, newKey, cloudStorageInstant.Image)
		if err != nil {
			return nil, err
		}
		in.Question.ImageDescriptionUrl = &newKey
	}

	if in.HintImage != nil {
		if in.Question.ImageHintUrl != nil {
			keysToDelete = append(keysToDelete, *in.Question.ImageHintUrl)
		}
		newKey := uuid.NewString()
		err := service.cloudStorage.ObjectCreate(in.HintImage, newKey, cloudStorageInstant.Image)
		if err != nil {
			return nil, err
		}
		in.Question.ImageHintUrl = &newKey
	}

	_, err := service.academicLevelStorage.QuestionUpdate(in.Tx, &in.Question)
	if err != nil {
		return nil, err
	}

	return &UpdateQuestionOutput{KeysToDelete: keysToDelete}, nil
}
