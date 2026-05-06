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

type QuestionInputCreateRequest struct {
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
	InputType                  string  `form:"input_type" validate:"required"`
	HintType                   string  `form:"hint_type" validate:"required"`
	CorrectTextId              *string `form:"correct_text_id"`
	WrongTextId                *string `form:"wrong_text_id"`
	Descriptions               string  `form:"descriptions" validate:"required"`
	UseSoundDescriptionOnly    *bool   `form:"use_sound_description_only"`
}

// ==================== Response ==========================

type QuestionInputCreateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionInputCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionInputCreateRequest{})
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

	var descriptions []constant.QuestionInputDescriptionEntity
	if request.Descriptions != "" {
		err := json.Unmarshal([]byte(request.Descriptions), &descriptions)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid descriptions"
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

	questionInputCreateOutput, err := api.Service.QuestionInputCreate(&QuestionInputCreateInput{
		Roles:                      roles,
		SubjectId:                  subjectId,
		QuestionInputCreateRequest: request,
		Descriptions:               descriptions,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(QuestionInputCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []interface{}{questionInputCreateOutput.QuestionInput},
		Message:    "Question created",
	})

}

// ==================== Service ==========================

type QuestionInputCreateInput struct {
	Roles     []int
	SubjectId string
	*QuestionInputCreateRequest
	Descriptions []constant.QuestionInputDescriptionEntity
}

type QuestionInputCreateOutput struct {
	QuestionInput interface{}
}

func (service *serviceStruct) QuestionInputCreate(in *QuestionInputCreateInput) (*QuestionInputCreateOutput, error) {
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
	err = copier.Copy(&question, in.QuestionInputCreateRequest)
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

	questionInputEntity := constant.QuestionInputEntity{}
	err = copier.Copy(&questionInputEntity, in.QuestionInputCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionInputEntity.QuestionId = question.Id

	_, err = service.academicLevelStorage.QuestionInputCreate(tx, &questionInputEntity)
	if err != nil {
		return nil, err
	}

	getSubjectLanguageOutput, err := service.GetSubjectLanguage(&GetSubjectLanguageInput{
		LevelId: in.LevelId,
	})
	if err != nil {
		return nil, err
	}

	err = service.CreateQuestionInputDescriptions(&CreateQuestionInputDescriptionsInput{
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

	getFullQuestionInputOutput, err := service.GetFullQuestionInput(&GetFullQuestionInputInput{
		constant.QuestionEntity{Id: question.Id},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionInputCreateOutput{getFullQuestionInputOutput.FullQuestionInput}, nil
}
