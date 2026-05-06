package service

import (
	"log"
	"net/http"
	"time"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type QuestionCaseCreateSpeechRequest struct {
	Text []QuestionTextToAi `json:"text" validate:"required,dive"`
}

type QuestionTextToAi struct {
	SavedTextGroupId string  `json:"saved_text_group_id" validate:"required"`
	Language         string  `json:"language" validate:"required"`
	TextToAi         string  `json:"text_to_ai" validate:"required"`
	AdminLoginAs     *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type QuestionCaseCreateSpeechResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionCaseCreateSpeech(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionCaseCreateSpeechRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
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

	err = api.Service.QuestionCaseCreateSpeech(&QuestionCaseCreateSpeechInput{
		SubjectId:                       subjectId,
		Roles:                           roles,
		QuestionCaseCreateSpeechRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionCaseCreateSpeechResponse{
		StatusCode: http.StatusOK,
		Message:    "Created",
	})

}

// ==================== Service ==========================

type QuestionCaseCreateSpeechInput struct {
	SubjectId string
	Roles     []int
	*QuestionCaseCreateSpeechRequest
}

func (service *serviceStruct) QuestionCaseCreateSpeech(in *QuestionCaseCreateSpeechInput) error {

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	keysToDelete := []string{}
	for _, questionTextToAi := range in.Text {
		savedText, err := service.academicLevelStorage.SavedTextCaseGetByGroupLanguage(nil, questionTextToAi.SavedTextGroupId, questionTextToAi.Language)
		if err != nil {
			return err
		}

		err = service.CheckContentCreator(&CheckContentCreatorInput{
			SubjectId:         in.SubjectId,
			Roles:             in.Roles,
			CurriculumGroupId: savedText.CurriculumGroupId,
		})
		if err != nil {
			return err
		}

		if savedText.SpeechUrl != nil {
			keysToDelete = append(keysToDelete, *savedText.SpeechUrl)
		}

		key := uuid.NewString()
		bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(questionTextToAi.TextToAi, questionTextToAi.Language)
		if err != nil {
			return err
		}

		err = service.cloudStorage.ObjectCreate(bytes, key, cloudStorageConstant.Speech)
		if err != nil {
			return err
		}

		savedText.SpeechUrl = &key
		now := time.Now().UTC()
		savedText.UpdatedAt = &now
		savedText.UpdatedBy = &in.SubjectId
		savedText.AdminLoginAs = questionTextToAi.AdminLoginAs

		_, err = service.academicLevelStorage.SavedTextUpdate(tx, savedText)
		if err != nil {
			return err
		}

		subLessonIds, err := service.academicLevelStorage.SavedTextCaseGetSubLessonId(tx, questionTextToAi.SavedTextGroupId)
		if err != nil {
			return err
		}

		err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, subLessonIds, false, in.SubjectId)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	for _, key := range keysToDelete {
		err := service.cloudStorage.ObjectDelete(key)
		if err != nil {
			return err
		}
	}

	return nil
}
