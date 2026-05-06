package service

import (
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"mime/multipart"
	"net/http"
)

type CreateQuestionGroupChoicesInput struct {
	Tx                        *sqlx.Tx
	QuestionId                int
	QuestionGroupGroups       []constant.QuestionGroupGroupEntity
	QuestionGroupTextChoices  []constant.QuestionGroupChoiceEntity
	QuestionGroupImageChoices []constant.QuestionGroupChoiceEntity
	ChoiceImages              []*multipart.FileHeader
}

func (service *serviceStruct) CreateQuestionGroupChoices(in *CreateQuestionGroupChoicesInput) error {
	if in.QuestionGroupTextChoices != nil {
		for _, questionGroupChoice := range in.QuestionGroupTextChoices {
			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: questionGroupChoice.SavedTextGroupId,
				Type:             constant.Choice,
			}
			questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				return err
			}

			questionGroupChoice.QuestionGroupId = in.QuestionId
			questionGroupChoice.QuestionTextId = &questionText.Id
			savedQuestionGroupChoice, err := service.academicLevelStorage.QuestionGroupChoiceCreate(in.Tx, &questionGroupChoice)
			if err != nil {
				return err
			}
			savedQuestionGroupChoice.GroupIndexes = questionGroupChoice.GroupIndexes

			err = service.CreateQuestionGroupGroupMember(&CreateQuestionGroupGroupMemberInput{
				Tx:                  in.Tx,
				QuestionGroupGroups: in.QuestionGroupGroups,
				QuestionGroupChoice: *savedQuestionGroupChoice,
			})
			if err != nil {
				return err
			}
		}
	}

	if in.QuestionGroupImageChoices != nil {
		for i, questionGroupChoice := range in.QuestionGroupImageChoices {
			questionGroupChoice.QuestionGroupId = in.QuestionId
			if len(in.ChoiceImages) <= i {
				msg := "Invalid image choices"
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}

			objectKey := uuid.NewString()
			err := service.cloudStorage.ObjectCreate(in.ChoiceImages[i], objectKey, cloudStorageConstant.Image)
			if err != nil {
				return err
			}

			questionGroupChoice.ImageUrl = &objectKey
			savedQuestionGroupChoice, err := service.academicLevelStorage.QuestionGroupChoiceCreate(in.Tx, &questionGroupChoice)
			if err != nil {
				return err
			}
			savedQuestionGroupChoice.GroupIndexes = questionGroupChoice.GroupIndexes

			err = service.CreateQuestionGroupGroupMember(&CreateQuestionGroupGroupMemberInput{
				Tx:                  in.Tx,
				QuestionGroupGroups: in.QuestionGroupGroups,
				QuestionGroupChoice: *savedQuestionGroupChoice,
			})
			if err != nil {
				return err
			}
		}
	}

	return nil
}
