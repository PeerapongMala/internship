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

type QuestionPlaceholderCreateRequest struct {
	LevelId                    int     `form:"level_id" validate:"required"`
	QuestionType               string  `form:"question_type" validate:"required"`
	TimerType                  string  `form:"timer_type" validate:"required"`
	TimerTime                  int     `form:"timer_time"`
	ChoicePosition             string  `form:"choice_position" db:"choice_position"`
	Layout                     string  `form:"layout" validate:"required"`
	LeftBoxColumns             string  `form:"left_box_columns" validate:"required"`
	LeftBoxRows                string  `form:"left_box_rows" validate:"required"`
	BottomBoxColumns           string  `form:"bottom_box_columns" validate:"required"`
	BottomBoxRows              string  `form:"bottom_box_rows" validate:"required"`
	EnforceDescriptionLanguage *bool   `form:"enforce_description_language" validate:"required"`
	EnforceChoiceLanguage      *bool   `form:"enforce_choice_language" validate:"required"`
	CommandTextId              string  `form:"command_text_id"`
	DescriptionTextId          *string `form:"description_text_id"`
	DescriptionImage           *multipart.FileHeader
	HintTextId                 *string `form:"hint_text_id"`
	HintImage                  *multipart.FileHeader
	HintType                   string  `form:"hint_type" validate:"required"`
	ChoiceType                 string  `form:"choice_type" validate:"required"`
	ChoiceAmount               int     `form:"choice_amount" validate:"required"`
	DummyAmount                int     `form:"dummy_amount"`
	CanReuseChoice             *bool   `form:"can_reuse_choice" validate:"required"`
	CorrectTextId              *string `form:"correct_text_id"`
	WrongTextId                *string `form:"wrong_text_id"`
	Descriptions               string  `form:"descriptions"`
	TextChoices                string  `form:"text_choices"`
	UseSoundDescriptionOnly    *bool   `form:"use_sound_description_only"`
}

// ==================== Response ==========================

type QuestionPlaceholderCreateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionPlaceholderCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionPlaceholderCreateRequest{})
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

	var descriptions []constant.QuestionPlaceholderDescriptionEntity
	if request.Descriptions != "" {
		err := json.Unmarshal([]byte(request.Descriptions), &descriptions)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid descriptions"
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
		}
	}

	var textChoices []constant.QuestionPlaceholderTextChoiceEntity
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

	questionPlaceholderCreateOutput, err := api.Service.QuestionPlaceholderCreate(&QuestionPlaceholderCreateInput{
		Roles:                            roles,
		SubjectId:                        subjectId,
		QuestionPlaceholderCreateRequest: request,
		Descriptions:                     descriptions,
		TextChoices:                      textChoices,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(QuestionPlaceholderCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []interface{}{questionPlaceholderCreateOutput.QuestionPlaceholder},
		Message:    "Question Created",
	})
}

// ==================== Service ==========================

type QuestionPlaceholderCreateInput struct {
	Roles     []int
	SubjectId string
	*QuestionPlaceholderCreateRequest
	Descriptions []constant.QuestionPlaceholderDescriptionEntity
	TextChoices  []constant.QuestionPlaceholderTextChoiceEntity
}

type QuestionPlaceholderCreateOutput struct {
	QuestionPlaceholder interface{}
}

func (service *serviceStruct) QuestionPlaceholderCreate(in *QuestionPlaceholderCreateInput) (*QuestionPlaceholderCreateOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.LevelCaseGetCurriculumGroupId(in.LevelId)
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

	question := constant.QuestionEntity{}
	err = copier.Copy(&question, in.QuestionPlaceholderCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	createQuestionOutput, err := service.CreateQuestion(&CreateQuestionInput{
		Tx:               tx,
		LevelId:          in.LevelId,
		Question:         question,
		DescriptionImage: in.DescriptionImage,
		HintImage:        in.HintImage,
	})
	if err != nil {
		return nil, err
	}
	question = createQuestionOutput.Question

	err = service.CreateQuestionText(&CreateQuestionTextInput{
		Tx:         tx,
		QuestionId: question.Id,
		TextMap: map[string]*string{
			constant.Command:     &in.CommandTextId,
			constant.Description: in.DescriptionTextId,
			constant.Hint:        in.HintTextId,
			constant.CorrectText: in.CorrectTextId,
			constant.WrongText:   in.WrongTextId,
		},
	})
	if err != nil {
		return nil, err
	}

	questionPlaceholderEntity := constant.QuestionPlaceholderEntity{}
	err = copier.Copy(&questionPlaceholderEntity, in.QuestionPlaceholderCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionPlaceholderEntity.QuestionId = question.Id

	_, err = service.academicLevelStorage.QuestionPlaceholderCreate(tx, &questionPlaceholderEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	getSubjectLanguageOutput, err := service.GetSubjectLanguage(&GetSubjectLanguageInput{
		LevelId: in.LevelId,
	})
	if err != nil {
		return nil, err
	}

	err = service.CreateQuestionPlaceholderTextChoices(&CreateQuestionPlaceholderTextChoicesInput{
		Tx:                tx,
		CurriculumGroupId: *curriculumGroupId,
		QuestionId:        question.Id,
		SubjectLanguage:   getSubjectLanguageOutput.SubjectLanguage,
		TextChoices:       in.TextChoices,
		SubjectId:         in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	err = service.CreateQuestionPlaceholderDescriptions(&CreateQuestionPlaceholderDescriptionsInput{
		Tx:                tx,
		CurriculumGroupId: *curriculumGroupId,
		QuestionId:        question.Id,
		SubjectLanguage:   getSubjectLanguageOutput.SubjectLanguage,
		Descriptions:      in.Descriptions,
		SubjectId:         in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

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

	getFullQuestionPlaceholderOutput, err := service.GetFullQuestionPlaceholder(&GetFullQuestionPlaceholderInput{
		constant.QuestionEntity{Id: question.Id},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionPlaceholderCreateOutput{
		getFullQuestionPlaceholderOutput.FullQuestionPlaceholder,
	}, nil
}
