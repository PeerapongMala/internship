package service

import (
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"mime/multipart"
)

type CreateQuestionInput struct {
	Tx               *sqlx.Tx
	LevelId          int
	Question         constant.QuestionEntity
	DescriptionImage *multipart.FileHeader
	HintImage        *multipart.FileHeader
}

type CreateQuestionOutput struct {
	Question constant.QuestionEntity
}

func (service *serviceStruct) CreateQuestion(in *CreateQuestionInput) (*CreateQuestionOutput, error) {
	lastQuestionIndex, err := service.academicLevelStorage.LevelCaseGetLastQuestionIndex(in.LevelId)
	if err != nil {
		return nil, err
	}
	in.Question.Index = *lastQuestionIndex + 1

	if in.DescriptionImage != nil {
		descriptionImageKey := uuid.NewString()
		err = service.cloudStorage.ObjectCreate(in.DescriptionImage, descriptionImageKey, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
		in.Question.ImageDescriptionUrl = &descriptionImageKey
	}

	if in.HintImage != nil {
		hintImageKey := uuid.NewString()
		err = service.cloudStorage.ObjectCreate(in.HintImage, hintImageKey, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
		in.Question.ImageHintUrl = &hintImageKey
	}

	question, err := service.academicLevelStorage.QuestionCreate(in.Tx, &in.Question)
	if err != nil {
		return nil, err
	}

	return &CreateQuestionOutput{
		*question,
	}, nil

}
