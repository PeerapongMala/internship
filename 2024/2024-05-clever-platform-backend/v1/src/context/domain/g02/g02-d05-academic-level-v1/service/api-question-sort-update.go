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

type QuestionSortUpdateRequest struct {
	TimerType                  string  `form:"timer_type"`
	TimerTime                  int     `form:"timer_time"`
	ChoicePosition             string  `form:"choice_position"`
	Layout                     string  `form:"layout"`
	LeftBoxColumns             string  `form:"left_box_columns"`
	LeftBoxRows                string  `form:"left_box_rows"`
	BottomBoxColumns           string  `form:"bottom_box_columns"`
	BottomBoxRows              string  `form:"bottom_box_rows"`
	EnforceDescriptionLanguage *bool   `form:"enforce_description_language"`
	EnforceChoiceLanguage      *bool   `form:"enforce_choice_language"`
	CommandTextId              *string `form:"command_text_id"`
	DescriptionTextId          *string `form:"description_text_id"`
	DescriptionImage           *multipart.FileHeader
	HintTextId                 *string `form:"hint_text_id"`
	HintImage                  *multipart.FileHeader
	UseSoundDescriptionOnly    *bool   `form:"use_sound_description_only" `
	ChoiceAmount               int     `form:"choice_amount"`
	CanReuseChoice             *bool   `form:"can_reuse_choice"`
	DummyAmount                int     `form:"dummy_amount"`
	TextChoices                string  `form:"text_choices"`
	CorrectTextId              *string `form:"correct_text_id"`
	WrongTextId                *string `form:"wrong_text_id"`
	DeleteDescriptionImage     bool    `form:"delete_description_image"`
	DeleteHintImage            bool    `form:"delete_hint_image"`
}

// ==================== Response ==========================

type QuestionSortUpdateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

func (api *APIStruct) QuestionSortUpdate(context *fiber.Ctx) error {
	questionId, err := context.ParamsInt("questionId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &QuestionSortUpdateRequest{})
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

	var textChoices []constant.QuestionSortTextChoiceEntity
	if request.TextChoices != "" {
		err = json.Unmarshal([]byte(request.TextChoices), &textChoices)
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

	questionSortUpdateOutput, err := api.Service.QuestionSortUpdate(&QuestionSortUpdateInput{
		Roles:                     roles,
		SubjectId:                 subjectId,
		QuestionId:                questionId,
		QuestionSortUpdateRequest: request,
		TextChoices:               textChoices,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionSortUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []interface{}{questionSortUpdateOutput.QuestionSort},
		Message:    "Question Updated",
	})

}

// ==================== Service ==========================

type QuestionSortUpdateInput struct {
	Roles      []int
	SubjectId  string
	QuestionId int
	*QuestionSortUpdateRequest
	TextChoices []constant.QuestionSortTextChoiceEntity
}

type QuestionSortUpdateOutput struct {
	QuestionSort interface{}
}

func (service *serviceStruct) QuestionSortUpdate(in *QuestionSortUpdateInput) (*QuestionSortUpdateOutput, error) {
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

	question, err := service.academicLevelStorage.QuestionGet(in.QuestionId)
	if err != nil {
		return nil, err
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	keysToDelete := []string{}

	questionEntity := constant.QuestionEntity{}
	err = copier.Copy(&questionEntity, in.QuestionSortUpdateRequest)
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

	questionSortEntity := constant.QuestionSortEntity{}
	err = copier.Copy(&questionSortEntity, in.QuestionSortUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionSortEntity.QuestionId = in.QuestionId

	_, err = service.academicLevelStorage.QuestionSortUpdate(tx, &questionSortEntity)
	if err != nil {
		return nil, err
	}

	updateQuestionTextOutput, err := service.UpdateQuestionText(&UpdateQuestionTextInput{
		Tx:         tx,
		QuestionId: in.QuestionId,
		TextMap: map[string]*string{
			constant.Command:     in.CommandTextId,
			constant.Description: in.DescriptionTextId,
			constant.Hint:        in.HintTextId,
			constant.CorrectText: in.CorrectTextId,
			constant.WrongText:   in.WrongTextId,
		},
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, updateQuestionTextOutput.KeysToDelete...)

	updateQuestionSortTextChoices, err := service.UpdateQuestionSortTextChoices(&UpdateQuestionSortTextChoicesInput{
		Tx:          tx,
		TextChoices: in.TextChoices,
		QuestionId:  in.QuestionId,
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, updateQuestionSortTextChoices.KeysToDelete...)

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

	getFullQuestionSortOutput, err := service.GetFullQuestionSort(&GetFullQuestionSortInput{constant.QuestionEntity{Id: in.QuestionId}})
	if err != nil {
		return nil, err
	}

	return &QuestionSortUpdateOutput{
		getFullQuestionSortOutput.FullQuestionSort,
	}, nil
}
