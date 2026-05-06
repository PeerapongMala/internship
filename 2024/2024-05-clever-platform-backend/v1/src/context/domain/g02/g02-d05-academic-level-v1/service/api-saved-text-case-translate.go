package service

import (
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type SavedTextCaseTranslateRequest struct {
	SrcText       string   `json:"src_text" validate:"required"`
	SrcLanguage   string   `json:"src_language" validate:"required"`
	DestLanguages []string `json:"dest_languages" validate:"required"`
}

// ==================== Response ==========================

type SavedTextCaseTranslateResponse struct {
	StatusCode int                 `json:"status_code"`
	Data       []map[string]string `json:"data"`
	Message    string              `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCaseTranslate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SavedTextCaseTranslateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	savedTextCaseTranslateOutput, err := api.Service.SavedTextCaseTranslate(&SavedTextCaseTranslateInput{
		SavedTextCaseTranslateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextCaseTranslateResponse{
		StatusCode: http.StatusOK,
		Data:       []map[string]string{savedTextCaseTranslateOutput.Translations},
		Message:    "Translated",
	})
}

// ==================== Service ==========================

type SavedTextCaseTranslateInput struct {
	*SavedTextCaseTranslateRequest
}

type SavedTextCaseTranslateOutput struct {
	Translations map[string]string
}

func (service *serviceStruct) SavedTextCaseTranslate(in *SavedTextCaseTranslateInput) (*SavedTextCaseTranslateOutput, error) {
	translations := map[string]string{}
	for _, language := range in.DestLanguages {
		if slices.Contains(in.DestLanguages, language) {
			data, err := service.translateStorage.GoogleTranslateCaseTranslate(language, in.SrcText)
			if err != nil {
				return nil, err
			}
			translations[language] = *data
		}
	}

	return &SavedTextCaseTranslateOutput{
		Translations: translations,
	}, nil
}
