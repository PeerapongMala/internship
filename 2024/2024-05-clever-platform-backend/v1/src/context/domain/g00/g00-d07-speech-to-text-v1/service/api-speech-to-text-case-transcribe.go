package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"mime/multipart"
	"net/http"
)

// ==================== Request ==========================

type SpeechToTextCaseTranscribeRequest struct {
	AudioFile *multipart.FileHeader
	Language  string `form:"language" validate:"required"`
}

// ==================== Response ==========================

type SpeechToTextCaseTranscribeResponse struct {
	StatusCode int              `json:"status_code"`
	Data       []TranscriptData `json:"data"`
	Message    string           `json:"message"`
}

type TranscriptData struct {
	Transcript string `json:"transcript"`
}

func (api *APIStruct) SpeechToTextCaseTranscribe(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SpeechToTextCaseTranscribeRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	audioFile, err := context.FormFile("audio_file")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.AudioFile = audioFile

	speechToTextTranscribeOutput, err := api.Service.SpeechToTextCaseTranscribe(&SpeechToTextCaseTranscribeInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&SpeechToTextCaseTranscribeResponse{
		StatusCode: http.StatusOK,
		Data: []TranscriptData{{
			speechToTextTranscribeOutput.Transcript,
		}},
		Message: "Transcribed",
	})
}

// ==================== Service ==========================

type SpeechToTextCaseTranscribeInput struct {
	*SpeechToTextCaseTranscribeRequest
}

type SpeechToTextCaseTranscribeOutput struct {
	Transcript string
}

func (service *serviceStruct) SpeechToTextCaseTranscribe(in *SpeechToTextCaseTranscribeInput) (*SpeechToTextCaseTranscribeOutput, error) {
	locale, err := constant.ConvertToLocale(in.Language)
	if err != nil {
		return nil, err
	}

	transcript, err := service.googleSpeechToTextStorage.GoogleSpeechToTextCaseTranscribe(*locale, in.AudioFile)
	if err != nil {
		return nil, err
	}

	return &SpeechToTextCaseTranscribeOutput{
		*transcript,
	}, nil
}
