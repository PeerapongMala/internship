package service

import (
	"encoding/json"
	"fmt"
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

type QuestionMultipleChoiceCreateRequest struct {
	LevelId                    int     `form:"level_id" validate:"required"`
	QuestionType               string  `form:"question_type" validate:"required"`
	TimerType                  string  `form:"timer_type" validate:"required"`
	TimerTime                  int     `form:"timer_time"`
	ChoicePosition             string  `form:"choice_position" validate:"required"`
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
	UseSoundDescriptionOnly    *bool  `form:"use_sound_description_only"`
	ChoiceType                 string `form:"choice_type" validate:"required"`
	CorrectChoiceAmount        string `form:"correct_choice_amount" validate:"required"`
	MaxPoint                   *int   `form:"max_point"`
	TextChoices                string `form:"text_choices"`
	ImageChoices               string `form:"image_choices"`
	ChoiceImages               []*multipart.FileHeader
	CorrectTextId              *string `form:"correct_text_id"`
	WrongTextId                *string `form:"wrong_text_id"`
}

// ==================== Response ==========================

type QuestionMultipleChoiceCreateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionMultipleChoiceCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionMultipleChoiceCreateRequest{})
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

	i := 0
	for {
		i++
		key := fmt.Sprintf(`choice_images_%d`, i)
		file, err := context.FormFile(key)
		if err != nil {
			if err.Error() == "there is no uploaded file associated with the given key" {
				break
			} else {
				log.Printf("%+v", errors.WithStack(err))
				return helper.RespondHttpError(context, err)
			}
		}
		request.ChoiceImages = append(request.ChoiceImages, file)
	}
	// files := form.File["choice_images"]
	// for _, file := range files {
	// 	request.ChoiceImages = append(request.ChoiceImages, file)
	// }

	var textChoices []constant.QuestionMultipleChoiceTextChoiceEntity
	if request.TextChoices != "" {
		err = json.Unmarshal([]byte(request.TextChoices), &textChoices)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid text choices"
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
		}
	}

	var imageChoices []constant.QuestionMultipleChoiceImageChoiceEntity
	if request.ImageChoices != "" {
		err := json.Unmarshal([]byte(request.ImageChoices), &imageChoices)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid image choices"
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

	questionMultipleChoiceCreateOutput, err := api.Service.QuestionMultipleChoiceCreate(&QuestionMultipleChoiceCreateInput{
		Roles:                               roles,
		SubjectId:                           subjectId,
		QuestionMultipleChoiceCreateRequest: request,
		TextChoices:                         textChoices,
		ImageChoices:                        imageChoices,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(QuestionMultipleChoiceCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []interface{}{questionMultipleChoiceCreateOutput.QuestionMultipleChoice},
		Message:    "Question created",
	})
}

// ==================== Service ==========================

type QuestionMultipleChoiceCreateInput struct {
	Roles     []int
	SubjectId string
	*QuestionMultipleChoiceCreateRequest
	TextChoices  []constant.QuestionMultipleChoiceTextChoiceEntity
	ImageChoices []constant.QuestionMultipleChoiceImageChoiceEntity
}

type QuestionMultipleChoiceCreateOutput struct {
	QuestionMultipleChoice interface{}
}

func (service *serviceStruct) QuestionMultipleChoiceCreate(in *QuestionMultipleChoiceCreateInput) (*QuestionMultipleChoiceCreateOutput, error) {
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
	err = copier.Copy(&question, in.QuestionMultipleChoiceCreateRequest)
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
	questionMultipleChoiceEntity := constant.QuestionMultipleChoiceEntity{}
	err = copier.Copy(&questionMultipleChoiceEntity, in.QuestionMultipleChoiceCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionMultipleChoiceEntity.QuestionId = question.Id

	_, err = service.academicLevelStorage.QuestionMultipleChoiceCreate(tx, &questionMultipleChoiceEntity)
	if err != nil {
		return nil, err
	}

	err = service.CreateQuestionMultipleChoiceChoices(&CreateQuestionMultipleChoiceChoicesInput{
		Tx:           tx,
		QuestionId:   question.Id,
		ChoiceType:   in.ChoiceType,
		TextChoices:  in.TextChoices,
		ImageChoices: in.ImageChoices,
		ChoiceImages: in.ChoiceImages,
		SubjectId:    in.SubjectId,
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

	getFullQuestionMultipleChoiceOutput, err := service.GetFullQuestionMultipleChoice(&GetFullQuestionMultipleChoiceInput{
		constant.QuestionEntity{Id: question.Id},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionMultipleChoiceCreateOutput{
		getFullQuestionMultipleChoiceOutput.FullQuestionMultipleChoice,
	}, nil
}
