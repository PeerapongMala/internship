package service

import (
	"log"
	"net/http"
	"slices"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SavedTextCaseDeleteSpeechRequest struct {
	Language     string  `json:"language" validate:"required"`
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type SavedTextCaseDeleteSpeechResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       []constant.SavedTextDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCaseDeleteSpeech(context *fiber.Ctx) error {
	groupId := context.Params("groupId")
	request, err := helper.ParseAndValidateRequest(context, &SavedTextCaseDeleteSpeechRequest{})
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

	savedTextCaseDeleteSpeechOutput, err := api.Service.SavedTextCaseDeleteSpeech(&SavedTextCaseDeleteSpeechInput{
		Roles:                            roles,
		SubjectId:                        subjectId,
		GroupId:                          groupId,
		SavedTextCaseDeleteSpeechRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextCaseDeleteSpeechResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SavedTextDataEntity{*savedTextCaseDeleteSpeechOutput.SavedTextDataEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SavedTextCaseDeleteSpeechInput struct {
	Roles     []int
	SubjectId string
	GroupId   string
	*SavedTextCaseDeleteSpeechRequest
}

type SavedTextCaseDeleteSpeechOutput struct {
	*constant.SavedTextDataEntity
}

func (service *serviceStruct) SavedTextCaseDeleteSpeech(in *SavedTextCaseDeleteSpeechInput) (*SavedTextCaseDeleteSpeechOutput, error) {
	savedText, err := service.academicLevelStorage.SavedTextCaseGetByGroupId(in.GroupId)
	if err != nil {
		return nil, err
	}

	curriculumGroupId := 0
	for _, value := range savedText.Translations {
		curriculumGroupId = value.CurriculumGroupId
	}

	contentCreators, err := service.academicLevelStorage.CurriculumGroupCaseListContentCreator(curriculumGroupId)
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

	target := savedText.Translations[in.Language]
	speechToDelete := target.SpeechUrl
	target.SpeechUrl = nil
	now := time.Now().UTC()
	target.UpdatedAt = &now
	target.UpdatedBy = &in.SubjectId
	updatedSavedText, err := service.academicLevelStorage.SavedTextCaseDeleteSpeech(nil, &target)
	if err != nil {
		return nil, err
	}
	savedText.Translations[in.Language] = *updatedSavedText

	if speechToDelete != nil {
		err = service.cloudStorage.ObjectDelete(*speechToDelete)
		if err != nil {
			return nil, err
		}
	}

	subLessonIds, err := service.academicLevelStorage.SavedTextCaseGetSubLessonId(nil, in.GroupId)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(nil, subLessonIds, false, in.SubjectId)
	if err != nil {
		return nil, err
	}

	for _, savedTextEntity := range savedText.Translations {
		if savedTextEntity.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*savedTextEntity.SpeechUrl)
			if err != nil {
				return nil, err
			}
			savedTextEntity.SpeechUrl = url
			savedText.Translations[savedTextEntity.Language] = savedTextEntity
		}
	}

	return &SavedTextCaseDeleteSpeechOutput{
		savedText,
	}, nil
}
