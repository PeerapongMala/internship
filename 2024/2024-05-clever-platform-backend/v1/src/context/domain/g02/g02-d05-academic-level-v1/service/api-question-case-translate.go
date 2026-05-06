package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type QuestionCaseTranslateRequest struct {
	Text []QuestionText `json:"text" validate:"required,dive"`
}

type QuestionText struct {
	SavedTextGroupId string   `json:"saved_text_group_id" validate:"required"`
	SrcText          string   `json:"src_text" validate:"required"`
	SrcLanguage      string   `json:"src_language" validate:"required"`
	DestLanguages    []string `json:"dest_languages" validate:"required"`
}

// ==================== Response ==========================

type QuestionCaseTranslateResponse struct {
	StatusCode int               `json:"status_code"`
	Data       []TranslationData `json:"data"`
	Message    string            `json:"message"`
}

type TranslationData struct {
	SavedTextGroupId string            `json:"saved_text_group_id"`
	Translations     map[string]string `json:"translations"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionCaseTranslate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionCaseTranslateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	questionCaseTranslateOutput, err := api.Service.QuestionCaseTranslate(&QuestionCaseTranslateInput{
		QuestionCaseTranslateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionCaseTranslateResponse{
		StatusCode: http.StatusOK,
		Data:       questionCaseTranslateOutput.Translations,
		Message:    "Translated",
	})
}

// ==================== Service ==========================

type QuestionCaseTranslateInput struct {
	*QuestionCaseTranslateRequest
}

type QuestionCaseTranslateOutput struct {
	Translations []TranslationData
}

func (service *serviceStruct) QuestionCaseTranslate(in *QuestionCaseTranslateInput) (*QuestionCaseTranslateOutput, error) {
	TranslationsDataList := []TranslationData{}

	for _, questionText := range in.QuestionCaseTranslateRequest.Text {
		TranslationData := TranslationData{
			SavedTextGroupId: questionText.SavedTextGroupId,
		}

		translations := map[string]string{}
		for _, destLanguage := range questionText.DestLanguages {
			translatedText, err := service.translateStorage.GoogleTranslateCaseTranslate(destLanguage, questionText.SrcText)
			if err != nil {
				return nil, err
			}
			translations[destLanguage] = *translatedText
		}
		TranslationData.Translations = translations
		TranslationsDataList = append(TranslationsDataList, TranslationData)
	}

	return &QuestionCaseTranslateOutput{TranslationsDataList}, nil
}
