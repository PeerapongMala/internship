package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type QuestionCaseTextToAiSaveRequest struct {
	Text []TextToAiSaveData `json:"text" validate:"required"`
}

type TextToAiSaveData struct {
	SavedTextGroupId string  `json:"saved_text_group_id" validate:"required"`
	Language         string  `json:"language" validate:"required"`
	TextToAi         string  `json:"text_to_ai" validate:"required"`
	AdminLoginAs     *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type QuestionCaseTextToAiSaveResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionCaseTextToAiSave(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionCaseTextToAiSaveRequest{})
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

	err = api.Service.QuestionCaseTextToAiSave(&QuestionCaseTextToAiSaveInput{
		SubjectId:                       subjectId,
		Roles:                           roles,
		QuestionCaseTextToAiSaveRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionCaseTextToAiSaveResponse{
		StatusCode: http.StatusOK,
		Message:    "Saved",
	})
}

// ==================== Service ==========================

type QuestionCaseTextToAiSaveInput struct {
	SubjectId string
	Roles     []int
	*QuestionCaseTextToAiSaveRequest
}

func (service *serviceStruct) QuestionCaseTextToAiSave(in *QuestionCaseTextToAiSaveInput) error {
	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, text := range in.Text {
		savedText, err := service.academicLevelStorage.SavedTextCaseGetByGroupLanguage(nil, text.SavedTextGroupId, text.Language)
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

		savedText.TextToAi = &text.TextToAi
		now := time.Now().UTC()
		savedText.UpdatedAt = &now
		savedText.UpdatedBy = &in.SubjectId
		savedText.AdminLoginAs = text.AdminLoginAs
		_, err = service.academicLevelStorage.SavedTextUpdate(tx, savedText)
		if err != nil {
			return err
		}

		subLessonIds, err := service.academicLevelStorage.SavedTextCaseGetSubLessonId(tx, text.SavedTextGroupId)
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

	return nil
}
