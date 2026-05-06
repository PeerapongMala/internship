package service

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
	"log"
	"mime/multipart"
	"net/http"
)

// ==================== Request ==========================

type QuestionPlaceholderUpdateRequest struct {
	// LevelId                    int     `form:"level_id" validate:"required"`
	TimerType                  string  `form:"timer_type"`
	TimerTime                  int     `form:"timer_time"`
	ChoicePosition             string  `form:"choice_position" db:"choice_position"`
	Layout                     string  `form:"layout"`
	LeftBoxColumns             string  `form:"left_box_columns"`
	LeftBoxRows                string  `form:"left_box_rows"`
	BottomBoxColumns           string  `form:"bottom_box_columns"`
	BottomBoxRows              string  `form:"bottom_box_rows"`
	EnforceDescriptionLanguage *bool   `form:"enforce_description_language"`
	EnforceChoiceLanguage      *bool   `form:"enforce_choice_language"`
	CommandTextId              string  `form:"command_text_id"`
	DescriptionTextId          *string `form:"description_text_id"`
	DescriptionImage           *multipart.FileHeader
	HintTextId                 *string `form:"hint_text_id"`
	HintImage                  *multipart.FileHeader
	HintType                   string  `form:"hint_type"`
	ChoiceType                 string  `form:"choice_type"`
	ChoiceAmount               int     `form:"choice_amount"`
	DummyAmount                int     `form:"dummy_amount"`
	CanReuseChoice             *bool   `form:"can_reuse_choice"`
	CorrectTextId              string  `form:"correct_text_id"`
	WrongTextId                *string `form:"wrong_text_id"`
	Descriptions               string  `form:"descriptions"`
	TextChoices                string  `form:"text_choices"`
	UseSoundDescriptionOnly    *bool   `form:"use_sound_description_only"`
	DeleteDescriptionImage     bool    `form:"delete_description_image"`
	DeleteHintImage            bool    `form:"delete_hint_image"`
}

// ==================== Response ==========================

type QuestionPlaceholderUpdateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionPlaceholderUpdate(context *fiber.Ctx) error {
	questionId, err := context.ParamsInt("questionId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &QuestionPlaceholderUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	form, err := context.MultipartForm()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	if len(form.File["description_image"]) > 0 {
		request.DescriptionImage = form.File["description_image"][0]
	}

	if len(form.File["hint_image"]) > 0 {
		request.HintImage = form.File["hint_image"][0]
	}

	descriptions := []constant.QuestionPlaceholderDescriptionEntity{}
	if request.Descriptions != "" {
		err := json.Unmarshal([]byte(request.Descriptions), &descriptions)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid descriptions"
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
		}
	}

	textChoices := []constant.QuestionPlaceholderTextChoiceEntity{}
	if request.TextChoices != "" {
		err := json.Unmarshal([]byte(request.TextChoices), &textChoices)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid text choices"
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
		}
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	questionPlaceholderUpdateOutput, err := api.Service.QuestionPlaceholderUpdate(&QuestionPlaceholderUpdateInput{
		Roles:                            roles,
		SubjectId:                        subjectId,
		QuestionId:                       questionId,
		QuestionPlaceholderUpdateRequest: request,
		Descriptions:                     descriptions,
		TextChoices:                      textChoices,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(QuestionPlaceholderUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []interface{}{questionPlaceholderUpdateOutput.QuestionPlaceholder},
		Message:    "Question updated",
	})
}

// ==================== Service ==========================

type QuestionPlaceholderUpdateInput struct {
	Roles      []int
	SubjectId  string
	QuestionId int
	*QuestionPlaceholderUpdateRequest
	Descriptions []constant.QuestionPlaceholderDescriptionEntity
	TextChoices  []constant.QuestionPlaceholderTextChoiceEntity
}

type QuestionPlaceholderUpdateOutput struct {
	QuestionPlaceholder interface{}
}

func (service *serviceStruct) QuestionPlaceholderUpdate(in *QuestionPlaceholderUpdateInput) (*QuestionPlaceholderUpdateOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.QuestionCaseGetCurriculumGroupId(in.QuestionId)
	if err != nil {
		return nil, err
	}

	err = service.CheckContentCreator(&CheckContentCreatorInput{
		SubjectId:         in.SubjectId,
		Roles:             in.Roles,
		CurriculumGroupId: *curriculumGroupId,
	})
	if err != nil {
		return nil, err
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	keysToDelete := []string{}

	question, err := service.academicLevelStorage.QuestionGet(in.QuestionId)
	if err != nil {
		return nil, err
	}

	// question
	questionEntity := constant.QuestionEntity{}
	err = copier.Copy(&questionEntity, in.QuestionPlaceholderUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionEntity.Id = in.QuestionId
	questionEntity.ImageDescriptionUrl = question.ImageDescriptionUrl
	questionEntity.ImageHintUrl = question.ImageHintUrl
	question.DeleteDescriptionImage = in.DeleteDescriptionImage
	question.DeleteHintImage = in.DeleteHintImage

	updateQuestionOutput, err := service.UpdateQuestion(&UpdateQuestionInput{
		Tx:               tx,
		Question:         questionEntity,
		DescriptionImage: in.DescriptionImage,
		HintImage:        in.HintImage,
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, updateQuestionOutput.KeysToDelete...)

	questionPlaceholderEntity := constant.QuestionPlaceholderEntity{}
	err = copier.Copy(&questionPlaceholderEntity, in.QuestionPlaceholderUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionPlaceholderEntity.QuestionId = in.QuestionId

	_, err = service.academicLevelStorage.QuestionPlaceholderUpdate(tx, &questionPlaceholderEntity)
	if err != nil {
		return nil, err
	}

	updateQuestionTextOutput, err := service.UpdateQuestionText(&UpdateQuestionTextInput{
		Tx:         tx,
		QuestionId: in.QuestionId,
		TextMap: map[string]*string{
			constant.Command:     &in.CommandTextId,
			constant.Description: in.DescriptionTextId,
			constant.Hint:        in.HintTextId,
			constant.CorrectText: &in.CorrectTextId,
			constant.WrongText:   in.WrongTextId,
		},
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, updateQuestionTextOutput.KeysToDelete...)

	updateQuestionPlaceholderTextChoicesOutput, err := service.UpdateQuestionPlaceholderTextChoices(&UpdateQuestionPlaceholderTextChoicesInput{
		Tx:                tx,
		CurriculumGroupId: *curriculumGroupId,
		TextChoices:       in.TextChoices,
		QuestionId:        in.QuestionId,
		SubjectId:         in.SubjectId,
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, updateQuestionPlaceholderTextChoicesOutput.KeysToDelete...)

	updateQuestionPlaceholderDescriptionsOutput, err := service.UpdateQuestionPlaceholderDescriptions(&UpdateQuestionPlaceholderDescriptionsInput{
		Tx:                tx,
		CurriculumGroupId: *curriculumGroupId,
		Descriptions:      in.Descriptions,
		QuestionId:        in.QuestionId,
		SubjectId:         in.SubjectId,
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, updateQuestionPlaceholderDescriptionsOutput.KeysToDelete...)

	level, err := service.academicLevelStorage.LevelGet(question.LevelId)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, []int{level.SubLessonId}, false, in.SubjectId)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	for _, key := range keysToDelete {
		err := service.cloudStorage.ObjectDelete(key)
		if err != nil {
			return nil, err
		}
	}

	getFullQuestionPlaceholderOutput, err := service.GetFullQuestionPlaceholder(&GetFullQuestionPlaceholderInput{
		constant.QuestionEntity{Id: in.QuestionId},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionPlaceholderUpdateOutput{
		getFullQuestionPlaceholderOutput.FullQuestionPlaceholder,
	}, nil
}
