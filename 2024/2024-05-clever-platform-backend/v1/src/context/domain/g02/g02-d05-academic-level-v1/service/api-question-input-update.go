package service

import (
	"encoding/json"
	"log"
	"mime/multipart"
	"net/http"
	"regexp"
	"slices"
	"strings"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	cloudStorageInstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type QuestionInputUpdateRequest struct {
	// LevelId                    int     `form:"level_id" validate:"required"`
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
	CommandTextId              string  `form:"command_text_id"`
	DescriptionTextId          *string `form:"description_text_id"`
	DescriptionImage           *multipart.FileHeader
	HintTextId                 *string `form:"hint_text_id"`
	HintImage                  *multipart.FileHeader
	InputType                  string  `form:"input_type"`
	HintType                   string  `form:"hint_type"`
	CorrectTextId              string  `form:"correct_text_id"`
	WrongTextId                *string `form:"wrong_text_id"`
	Descriptions               string  `form:"descriptions"`
	UseSoundDescriptionOnly    *bool   `form:"use_sound_description_only"`
	DeleteDescriptionImage     bool    `form:"delete_description_image"`
	DeleteHintImage            bool    `form:"delete_hint_image"`
}

// ==================== Response ==========================

type QuestionInputUpdateResponse struct {
	StatusCode int                                `json:"status_code"`
	Data       []constant.QuestionInputDataEntity `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionInputUpdate(context *fiber.Ctx) error {
	questionId, err := context.ParamsInt("questionId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &QuestionInputUpdateRequest{})
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

	questionInputUpdateOutput, err := api.Service.QuestionInputUpdate(&QuestionInputUpdateInput{
		Roles:                      roles,
		SubjectId:                  subjectId,
		QuestionId:                 questionId,
		QuestionInputUpdateRequest: request,
		Descriptions:               descriptions,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionInputUpdateResponse{
		StatusCode: http.StatusOK,
		Data: []constant.QuestionInputDataEntity{
			*questionInputUpdateOutput.QuestionInputDataEntity,
		},
		Message: "Question updated",
	})
}

// ==================== Service ==========================

type QuestionInputUpdateInput struct {
	Roles      []int
	SubjectId  string
	QuestionId int
	*QuestionInputUpdateRequest
	Descriptions []constant.QuestionInputDescriptionEntity
}

type QuestionInputUpdateOutput struct {
	*constant.QuestionInputDataEntity
}

func (service *serviceStruct) QuestionInputUpdate(in *QuestionInputUpdateInput) (*QuestionInputUpdateOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.QuestionCaseGetCurriculumGroupId(in.QuestionId)
	if err != nil {
		return nil, err
	}

	contentCreators, err := service.academicLevelStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
	if err != nil {
		return nil, err
	}
	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		isValid := false
		for _, contentCreator := range contentCreators {
			if contentCreator.Id == in.SubjectId {
				isValid = true
				break
			}
		}
		if !isValid || len(contentCreators) == 0 {
			msg := "User isn't content creator of this curriculum group"
			return nil, helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	question, err := service.academicLevelStorage.QuestionGet(in.QuestionId)
	if err != nil {
		return nil, err
	}

	// question
	questionEntity := constant.QuestionEntity{}
	err = copier.Copy(&questionEntity, in.QuestionInputUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionEntity.Id = in.QuestionId
	questionEntity.ImageDescriptionUrl = question.ImageDescriptionUrl
	questionEntity.ImageHintUrl = question.ImageHintUrl
	question.DeleteDescriptionImage = in.DeleteDescriptionImage
	question.DeleteHintImage = in.DeleteHintImage

	questionInputEntity := constant.QuestionInputEntity{}
	err = copier.Copy(&questionInputEntity, in.QuestionInputUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionInputEntity.QuestionId = in.QuestionId

	// command
	if in.CommandTextId != "" {
		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       in.QuestionId,
			SavedTextGroupId: &in.CommandTextId,
			Type:             constant.Command,
		}
		_, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}

		_, err = service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}
	}

	// description text
	if in.DescriptionTextId != nil {
		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       question.Id,
			SavedTextGroupId: in.DescriptionTextId,
			Type:             constant.Description,
		}

		speechKeys, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}

		for _, speechKey := range speechKeys {
			err := service.cloudStorage.ObjectDelete(speechKey)
			if err != nil {
				return nil, err
			}
		}

		_, err = service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}
	}

	// description image
	if in.DescriptionImage != nil {
		var objectKey string
		if question.ImageDescriptionUrl != nil {
			err := service.cloudStorage.ObjectDelete(*question.ImageDescriptionUrl)
			if err != nil {
				return nil, err
			}
			objectKey = *question.ImageDescriptionUrl
		}
		objectKey = uuid.NewString()
		err := service.cloudStorage.ObjectCreate(in.DescriptionImage, objectKey, cloudStorageInstant.Image)
		if err != nil {
			return nil, err
		}
		questionEntity.ImageDescriptionUrl = &objectKey
	}

	// hint text
	if in.HintTextId != nil {
		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       question.Id,
			SavedTextGroupId: in.HintTextId,
			Type:             constant.Hint,
		}

		_, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}

		_, err = service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}
	}

	// hint image
	if in.HintImage != nil {
		var objectKey string
		if question.ImageHintUrl != nil {
			err := service.cloudStorage.ObjectDelete(*question.ImageHintUrl)
			if err != nil {
				return nil, err
			}
			objectKey = *question.ImageHintUrl
		}
		objectKey = uuid.NewString()
		err := service.cloudStorage.ObjectCreate(in.HintImage, objectKey, cloudStorageInstant.Image)
		if err != nil {
			return nil, err
		}
		questionEntity.ImageHintUrl = &objectKey
	}

	// correct text
	if in.CorrectTextId != "" {
		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       in.QuestionId,
			SavedTextGroupId: &in.CorrectTextId,
			Type:             constant.CorrectText,
		}
		_, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}

		_, err = service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}
	}

	// wrong text
	if in.WrongTextId != nil {
		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       in.QuestionId,
			SavedTextGroupId: in.WrongTextId,
			Type:             constant.WrongText,
		}
		_, err := service.academicLevelStorage.QuestionTextCaseDeleteByType(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}

		_, err = service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}
	}

	// description
	if in.Descriptions != nil {
		speechKeys, err := service.academicLevelStorage.QuestionInputCaseDeleteDescription(tx, in.QuestionId)
		if err != nil {
			return nil, err
		}

		for _, speechKey := range speechKeys {
			err := service.cloudStorage.ObjectDelete(speechKey)
			if err != nil {
				return nil, err
			}
		}
	}

	subjectLanguage, err := service.academicLevelStorage.QuestionCaseGetSubjectLanguage(in.QuestionId)
	if err != nil {
		return nil, err
	}
	if subjectLanguage == nil {
		defaultLanguage := constant.Thai
		subjectLanguage = &defaultLanguage
	}

	for _, description := range in.Descriptions {
		speechKey := uuid.NewString()
		re := regexp.MustCompile(`\{Ans\d+\}`)
		answers := re.FindAllString(description.Text, -1)
		descriptionTextToSpeech := description.Text
		for i, answer := range answers {
			destString := ""
			if i < len(description.Answers) {
				if len(description.Answers[i].Text) >= 1 {
					destString = description.Answers[i].Text[0].Text
				}
			}
			descriptionTextToSpeech = strings.Replace(descriptionTextToSpeech, answer, destString, 1)
		}
		bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(descriptionTextToSpeech, *subjectLanguage)
		if err != nil {
			return nil, err
		}

		err = service.cloudStorage.ObjectCreate(bytes, speechKey, constant.Speech)
		if err != nil {
			return nil, err
		}

		groupId := uuid.NewString()
		savedTextEntity := constant.SavedTextEntity{
			// TODO dynamic language
			CurriculumGroupId: *curriculumGroupId,
			GroupId:           groupId,
			Language:          *subjectLanguage,
			Text:              &description.Text,
			SpeechUrl:         &speechKey,
			Status:            "hidden",
			CreatedAt:         time.Now().UTC(),
			CreatedBy:         in.SubjectId,
		}
		savedText, err := service.academicLevelStorage.SavedTextCreate(tx, &savedTextEntity)
		if err != nil {
			return nil, err
		}

		questionTextEntity := constant.QuestionTextEntity{
			QuestionId:       question.Id,
			SavedTextGroupId: &savedText.GroupId,
			Type:             constant.Description,
			Index:            &description.Index,
		}
		descriptionText, err := service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
		if err != nil {
			return nil, err
		}

		for _, answer := range description.Answers {
			questionInputAnswerEntity := constant.QuestionInputAnswerEntity{
				QuestionTextDescriptionId: descriptionText.Id,
				AnswerIndex:               answer.Index,
				Type:                      &answer.Type,
			}

			questionInputAnswer, err := service.academicLevelStorage.QuestionInputAnswerCreate(tx, &questionInputAnswerEntity)
			if err != nil {
				return nil, err
			}

			for _, text := range answer.Text {
				groupId := uuid.NewString()
				savedTextGroupEntity := constant.SavedTextEntity{
					CurriculumGroupId: *curriculumGroupId,
					GroupId:           groupId,
					// TODO dynamic language
					Language:  *subjectLanguage,
					Text:      &text.Text,
					Status:    "hidden",
					CreatedAt: time.Now().UTC(),
					CreatedBy: in.SubjectId,
				}
				savedTextGroup, err := service.academicLevelStorage.SavedTextCreate(tx, &savedTextGroupEntity)
				if err != nil {
					return nil, err
				}

				questionTextEntity := constant.QuestionTextEntity{
					QuestionId:       question.Id,
					SavedTextGroupId: &savedTextGroup.GroupId,
					Type:             constant.Choice,
				}
				savedQuestionText, err := service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
				if err != nil {
					return nil, err
				}

				questionInputAnswerTextEntity := constant.QuestionInputAnswerTextEntity{
					QuestionInputAnswerId: questionInputAnswer.Id,
					QuestionTextId:        savedQuestionText.Id,
					Index:                 text.Index,
				}
				_, err = service.academicLevelStorage.QuestionInputAnswerTextCreate(tx, &questionInputAnswerTextEntity)
				if err != nil {
					return nil, err
				}
			}
		}
	}

	savedQuestion, err := service.academicLevelStorage.QuestionUpdate(tx, &questionEntity)
	if err != nil {
		return nil, err
	}

	savedQuestionInput, err := service.academicLevelStorage.QuestionInputUpdate(tx, &questionInputEntity)
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

	command, err := service.academicLevelStorage.QuestionTextCaseGetByType(question.Id, constant.Command)
	if err != nil {
		return nil, err
	}

	for language, translation := range command.Translations {
		if translation.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*translation.SpeechUrl)
			if err != nil {
				return nil, err
			}
			*command.Translations[language].SpeechUrl = *url
		}
	}

	// description, err := service.academicLevelStorage.QuestionTextCaseGetByType(question.Id, constant.Description)
	// if err != nil {
	// 	return nil, err
	// }
	// for language, translation := range description.Translations {
	// 	if translation.SpeechUrl != nil {
	// 		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*translation.SpeechUrl)
	// 		if err != nil {
	// 			return nil, err
	// 		}
	// 		*description.Translations[language].SpeechUrl = *url
	// 	}
	// }

	hint, err := service.academicLevelStorage.QuestionTextCaseGetByType(question.Id, constant.Hint)
	if err != nil {
		return nil, err
	}
	for language, translation := range hint.Translations {
		if translation.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*translation.SpeechUrl)
			if err != nil {
				return nil, err
			}
			*hint.Translations[language].SpeechUrl = *url
		}
	}

	correctText, err := service.academicLevelStorage.QuestionTextCaseGetByType(question.Id, constant.CorrectText)
	if err != nil {
		return nil, err
	}
	for language, translation := range correctText.Translations {
		if translation.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*translation.SpeechUrl)
			if err != nil {
				return nil, err
			}
			*correctText.Translations[language].SpeechUrl = *url
		}
	}

	wrongText, err := service.academicLevelStorage.QuestionTextCaseGetByType(question.Id, constant.WrongText)
	if err != nil {
		return nil, err
	}
	for language, translation := range wrongText.Translations {
		if translation.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*translation.SpeechUrl)
			if err != nil {
				return nil, err
			}
			*wrongText.Translations[language].SpeechUrl = *url
		}
	}

	descriptions, err := service.academicLevelStorage.QuestionInputCaseListDescription(question.Id)
	if err != nil {
		return nil, err
	}
	for i, description := range descriptions {
		if description.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*description.SpeechUrl)
			if err != nil {
				return nil, err
			}
			descriptions[i].SpeechUrl = url
		}
	}

	return &QuestionInputUpdateOutput{
		QuestionInputDataEntity: &constant.QuestionInputDataEntity{
			QuestionEntity:      savedQuestion,
			QuestionInputEntity: savedQuestionInput,
			Command:             *command,
			Hint:                hint,
			CorrectText:         *correctText,
			WrongText:           wrongText,
			Descriptions:        descriptions,
		},
	}, nil
}
