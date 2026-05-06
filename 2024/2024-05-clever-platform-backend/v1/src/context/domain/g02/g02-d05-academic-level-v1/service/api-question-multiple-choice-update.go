package service

import (
	"encoding/json"
	"fmt"
	cloudStorageInstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"log"
	"mime/multipart"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type QuestionMultipleChoiceUpdateRequest struct {
	// LevelId                    int     `form:"level_id"`
	// Index                      int     `form:"index"`
	// QuestionType               string  `form:"question_type"`
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
	UseSoundDescriptionOnly    *bool  `form:"use_sound_description_only"`
	ChoiceType                 string `form:"choice_type"`
	CorrectChoiceAmount        string `form:"correct_choice_amount"`
	MaxPoint                   *int   `form:"max_point"`
	TextChoices                string `form:"text_choices"`
	ImageChoices               string `form:"image_choices"`
	ChoiceImages               []*multipart.FileHeader
	CorrectTextId              *string `form:"correct_text_id"`
	WrongTextId                *string `form:"wrong_text_id"`
	DeleteDescriptionImage     bool    `form:"delete_description_image"`
	DeleteHintImage            bool    `form:"delete_hint_image"`
}

// ==================== Response ==========================

type QuestionMultipleChoiceUpdateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

func (api *APIStruct) QuestionMultipleChoiceUpdate(context *fiber.Ctx) error {
	questionId, err := context.ParamsInt("questionId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &QuestionMultipleChoiceUpdateRequest{})
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
				value := context.FormValue(key)
				if value == "null" {
					request.ChoiceImages = append(request.ChoiceImages, nil)
					continue
				} else {
					break
				}
			} else {
				log.Printf("%+v", errors.WithStack(err))
				return helper.RespondHttpError(context, err)
			}
		}

		request.ChoiceImages = append(request.ChoiceImages, file)
	}

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

	questionMultipleChoiceUpdateOutput, err := api.Service.QuestionMultipleChoiceUpdate(&QuestionMultipleChoiceUpdateInput{
		Roles:                               roles,
		SubjectId:                           subjectId,
		QuestionId:                          questionId,
		QuestionMultipleChoiceUpdateRequest: request,
		TextChoices:                         textChoices,
		ImageChoices:                        imageChoices,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionMultipleChoiceUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []interface{}{questionMultipleChoiceUpdateOutput.QuestionMultipleChoice},
		Message:    "Question updated",
	})
}

// ==================== Service ==========================

type QuestionMultipleChoiceUpdateInput struct {
	Roles      []int
	SubjectId  string
	QuestionId int
	*QuestionMultipleChoiceUpdateRequest
	TextChoices  []constant.QuestionMultipleChoiceTextChoiceEntity
	ImageChoices []constant.QuestionMultipleChoiceImageChoiceEntity
}

type QuestionMultipleChoiceUpdateOutput struct {
	QuestionMultipleChoice interface{}
}

func (service *serviceStruct) QuestionMultipleChoiceUpdate(in *QuestionMultipleChoiceUpdateInput) (*QuestionMultipleChoiceUpdateOutput, error) {
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
	err = copier.Copy(&questionEntity, in.QuestionMultipleChoiceUpdateRequest)
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

	questionMultipleChoiceEntity := constant.QuestionMultipleChoiceEntity{}
	err = copier.Copy(&questionMultipleChoiceEntity, in.QuestionMultipleChoiceUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionMultipleChoiceEntity.QuestionId = in.QuestionId

	_, err = service.academicLevelStorage.QuestionMultipleChoiceUpdate(tx, &questionMultipleChoiceEntity)
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

	updateQuestionMultipleChoiceChoicesOutput, err := service.UpdateQuestionMultipleChoiceChoices(&UpdateQuestionMultipleChoiceChoicesInput{
		Tx:           tx,
		QuestionId:   in.QuestionId,
		ChoiceType:   in.ChoiceType,
		TextChoices:  in.TextChoices,
		ImageChoices: in.ImageChoices,
		ChoiceImages: in.ChoiceImages,
		SubjectId:    in.SubjectId,
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, updateQuestionMultipleChoiceChoicesOutput.KeysToDelete...)

	for key, value := range updateQuestionMultipleChoiceChoicesOutput.KeysToAdd {
		err := service.cloudStorage.ObjectCreate(value, key, cloudStorageInstant.Image)
		if err != nil {
			return nil, err
		}
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

	for _, key := range keysToDelete {
		err := service.cloudStorage.ObjectDelete(key)
		if err != nil {
			return nil, err
		}
	}

	getFullQuestionMultipleChoiceOutput, err := service.GetFullQuestionMultipleChoice(&GetFullQuestionMultipleChoiceInput{
		constant.QuestionEntity{
			Id: question.Id,
		},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionMultipleChoiceUpdateOutput{
		getFullQuestionMultipleChoiceOutput.FullQuestionMultipleChoice,
	}, nil
}
