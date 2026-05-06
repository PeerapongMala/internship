package service

import (
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
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

type CreateQuestionMultipleChoiceChoicesInput struct {
	Tx           *sqlx.Tx
	QuestionId   int
	ChoiceType   string
	TextChoices  []constant.QuestionMultipleChoiceTextChoiceEntity
	ImageChoices []constant.QuestionMultipleChoiceImageChoiceEntity
	ChoiceImages []*multipart.FileHeader
	SubjectId    string
}

func (service *serviceStruct) CreateQuestionMultipleChoiceChoices(in *CreateQuestionMultipleChoiceChoicesInput) error {
	// text choices
	if in.TextChoices != nil && slices.Contains([]string{constant.QuestionChoiceTypeTextSpeech, constant.QuestionChoiceTypeSpeech}, in.ChoiceType) {
		for _, textChoice := range in.TextChoices {
			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: &textChoice.SavedTextGroupId,
				Type:             constant.Choice,
			}
			questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return err
			}

			textChoice.QuestionMultipleChoiceId = in.QuestionId
			textChoice.QuestionTextId = questionText.Id

			_, err = service.academicLevelStorage.QuestionMultipleChoiceTextChoiceCreate(in.Tx, &textChoice)
			if err != nil {
				return err
			}
		}
	}

	// image choices
	if in.ImageChoices != nil && slices.Contains([]string{constant.QuestionChoiceTypeImage}, in.ChoiceType) {
		for i, imageChoice := range in.ImageChoices {
			imageChoice.QuestionMultipleChoiceId = in.QuestionId
			if len(in.ChoiceImages) <= i {
				msg := "Invalid image choices"
				err := helper.NewHttpError(http.StatusBadRequest, &msg)
				log.Printf("%+v", errors.WithStack(err))
				return err
			}

			objectKey := uuid.NewString()
			err := service.cloudStorage.ObjectCreate(in.ChoiceImages[i], objectKey, cloudStorageConstant.Image)
			if err != nil {
				return err
			}

			imageChoice.ImageUrl = objectKey
			savedImageChoice, err := service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCreate(in.Tx, &imageChoice)
			if err != nil {
				return err
			}
			signedUrl, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(savedImageChoice.ImageUrl)
			if err != nil {
				return err
			}
			savedImageChoice.ImageUrl = *signedUrl
			in.ImageChoices[i] = *savedImageChoice
		}
	}

	return nil
}
