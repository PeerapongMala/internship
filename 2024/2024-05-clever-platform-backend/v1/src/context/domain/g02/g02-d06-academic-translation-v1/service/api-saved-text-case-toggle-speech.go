package service

import (
	"fmt"
	"log"
	"net/http"
	"slices"
	"time"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SavedTextCaseToggleSpeechRequest struct {
	Language     string  `json:"language" validate:"required"`
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type SavedTextCaseToggleSpeechResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCaseToggleSpeech(context *fiber.Ctx) error {
	groupId := context.Params("groupId")
	request, err := helper.ParseAndValidateRequest(context, &SavedTextCaseToggleSpeechRequest{})
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

	_, err = api.Service.SaveTextCaseToggleSpeech(&SavedTextCaseToggleSpeechInput{
		Roles:                            roles,
		SubjectId:                        subjectId,
		GroupId:                          groupId,
		SavedTextCaseToggleSpeechRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextCaseToggleSpeechResponse{
		StatusCode: http.StatusOK,
		Message:    "Speech toggled",
	})
}

// ==================== Service ==========================

type SavedTextCaseToggleSpeechInput struct {
	Roles     []int
	SubjectId string
	GroupId   string
	*SavedTextCaseToggleSpeechRequest
}

type SavedTextCaseToggleSpeechOutput struct {
	*constant.SavedTextEntity
}

func (service *serviceStruct) SaveTextCaseToggleSpeech(in *SavedTextCaseToggleSpeechInput) (*SavedTextCaseToggleSpeechOutput, error) {
	savedTextData, err := service.academicTranslationStorage.SavedTextGet(in.GroupId)
	if err != nil {
		return nil, err
	}

	curriculumGroupId := 0
	for _, value := range savedTextData.Translations {
		curriculumGroupId = value.CurriculumGroupId
	}

	contentCreators, err := service.academicTranslationStorage.CurriculumGroupCaseListContentCreator(curriculumGroupId)
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

	tx, err := service.academicTranslationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	savedText, ok := savedTextData.Translations[in.Language]
	if !ok {
		msg := fmt.Sprintf(`Saved text of language %s not found`, in.Language)
		err := helper.NewHttpError(http.StatusConflict, &msg)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if savedText.SpeechUrl != nil {
		savedTextUpdateEntity := constant.SavedTextUpdateEntity{}
		err := copier.Copy(&savedTextUpdateEntity, savedText)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		now := time.Now().UTC()
		savedTextUpdateEntity.UpdatedAt = &now
		savedTextUpdateEntity.UpdatedBy = &in.SubjectId
		savedTextUpdateEntity.AdminLoginAs = in.AdminLoginAs

		updatedSavedText, err := service.academicTranslationStorage.SavedTextUpdate(tx, &savedTextUpdateEntity)
		if err != nil {
			return nil, err
		}

		err = service.academicTranslationStorage.SavedTextCaseDeleteSpeech(tx, savedText.Id)
		if err != nil {
			return nil, err
		}

		err = service.cloudStorage.ObjectDelete(*savedText.SpeechUrl)
		if err != nil {
			return nil, err
		}

		savedText = *updatedSavedText

	} else {
		key := uuid.NewString()
		if savedText.TextToAi != nil {
			bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(*savedText.TextToAi, savedText.Language)
			if err != nil {
				return nil, err
			}

			savedTextUpdateEntity := constant.SavedTextUpdateEntity{}
			err = copier.Copy(&savedTextUpdateEntity, savedText)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			savedTextUpdateEntity.SpeechUrl = key
			now := time.Now().UTC()
			savedTextUpdateEntity.UpdatedAt = &now
			savedTextUpdateEntity.UpdatedBy = &in.SubjectId
			savedTextUpdateEntity.AdminLoginAs = in.AdminLoginAs

			updatedSavedText, err := service.academicTranslationStorage.SavedTextUpdate(tx, &savedTextUpdateEntity)
			if err != nil {
				return nil, err
			}

			savedText = *updatedSavedText

			err = service.cloudStorage.ObjectCreate(bytes, key, cloudStorageConstant.Speech)
			if err != nil {
				return nil, err
			}
		}
	}

	if savedText.SpeechUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*savedText.SpeechUrl)
		if err != nil {
			return nil, err
		}
		savedText.SpeechUrl = url
	}

	subLessonIds, err := service.academicLevelStorage.SavedTextCaseGetSubLessonId(tx, in.GroupId)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, subLessonIds, false, in.SubjectId)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SavedTextCaseToggleSpeechOutput{
		SavedTextEntity: &savedText,
	}, nil
}
