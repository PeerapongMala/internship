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

type QuestionGroupCreateRequest struct {
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
	UseSoundDescriptionOnly    *bool  `form:"use_sound_description_only"`
	GroupAmount                int    `form:"group_amount" validate:"required"`
	Groups                     string `form:"groups" validate:"required"`
	ChoiceType                 string `form:"choice_type" validate:"required"`
	ChoiceAmount               int    `form:"choice_amount" validate:"required"`
	CanReuseChoice             *bool  `form:"can_reuse_choice" validate:"required"`
	DummyAmount                int    `form:"dummy_amount"`
	TextChoices                string `form:"text_choices"`
	ImageChoices               string `form:"image_choices"`
	ChoiceImages               []*multipart.FileHeader
	CorrectTextId              *string `form:"correct_text_id"`
	WrongTextId                *string `form:"wrong_text_id"`
}

// ==================== Response ==========================

type QuestionGroupCreateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionGroupCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionGroupCreateRequest{})
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

	var textChoices []constant.QuestionGroupChoiceEntity
	if request.TextChoices != "" {
		err = json.Unmarshal([]byte(request.TextChoices), &textChoices)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid text choices"
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
		}
	}

	var imageChoices []constant.QuestionGroupChoiceEntity
	if request.ImageChoices != "" {
		err := json.Unmarshal([]byte(request.ImageChoices), &imageChoices)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid image choices"
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
		}
	}

	var groups []constant.QuestionGroupGroupEntity
	if request.Groups != "" {
		err := json.Unmarshal([]byte(request.Groups), &groups)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			msg := "Invalid groups"
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

	questionGroupCreateOutput, err := api.Service.QuestionGroupCreate(&QuestionGroupCreateInput{
		Roles:                      roles,
		SubjectId:                  subjectId,
		QuestionGroupCreateRequest: request,
		TextChoices:                textChoices,
		ImageChoices:               imageChoices,
		Groups:                     groups,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(QuestionGroupCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []interface{}{questionGroupCreateOutput.QuestionGroup},
		Message:    "Question created",
	})
}

// ==================== Service ==========================

type QuestionGroupCreateInput struct {
	Roles     []int
	SubjectId string
	*QuestionGroupCreateRequest
	TextChoices  []constant.QuestionGroupChoiceEntity
	ImageChoices []constant.QuestionGroupChoiceEntity
	Groups       []constant.QuestionGroupGroupEntity
}

type QuestionGroupCreateOutput struct {
	QuestionGroup interface{}
}

func (service *serviceStruct) QuestionGroupCreate(in *QuestionGroupCreateInput) (*QuestionGroupCreateOutput, error) {
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
	err = copier.Copy(&question, in.QuestionGroupCreateRequest)
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

	questionGroupEntity := constant.QuestionGroupEntity{}
	err = copier.Copy(&questionGroupEntity, in.QuestionGroupCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionGroupEntity.QuestionId = question.Id

	_, err = service.academicLevelStorage.QuestionGroupCreate(tx, &questionGroupEntity)
	if err != nil {
		return nil, err
	}

	createQuestionGroupGroupsOutput, err := service.CreateQuestionGroupGroups(&CreateQuestionGroupGroupInput{
		Tx:         tx,
		QuestionId: question.Id,
		Groups:     in.Groups,
	})
	if err != nil {
		return nil, err
	}

	err = service.CreateQuestionGroupChoices(&CreateQuestionGroupChoicesInput{
		Tx:                        tx,
		QuestionId:                question.Id,
		QuestionGroupGroups:       createQuestionGroupGroupsOutput.Groups,
		QuestionGroupTextChoices:  in.TextChoices,
		QuestionGroupImageChoices: in.ImageChoices,
		ChoiceImages:              in.ChoiceImages,
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

	getFullQuestionGroup, err := service.GetFullQuestionGroup(&GetFullQuestionGroupInput{
		constant.QuestionEntity{Id: question.Id},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionGroupCreateOutput{
		getFullQuestionGroup.FullQuestionGroup,
	}, nil
}
