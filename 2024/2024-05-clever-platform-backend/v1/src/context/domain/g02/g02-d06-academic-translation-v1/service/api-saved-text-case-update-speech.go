package service

import (
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

type SavedTextCaseUpdateSpeechRequest struct {
	ThaiTextToAi    *string `json:"thai_text_to_ai"`
	EnglishTextToAi *string `json:"english_text_to_ai"`
	ChineseTextToAi *string `json:"chinese_text_to_ai"`
	AdminLoginAs    *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type SavedTextCaseUpdateSpeechResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       []constant.SavedTextDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCaseUpdateSpeech(context *fiber.Ctx) error {
	groupId := context.Params("groupId")
	request, err := helper.ParseAndValidateRequest(context, &SavedTextCaseUpdateSpeechRequest{})
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

	savedTextCaseUpdateSpeechOutput, err := api.Service.SavedTextCaseUpdateSpeech(&SavedTextCaseUpdateSpeechInput{
		Roles:                            roles,
		SubjectId:                        subjectId,
		GroupId:                          groupId,
		SavedTextCaseUpdateSpeechRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextCaseUpdateSpeechResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SavedTextDataEntity{*savedTextCaseUpdateSpeechOutput.SavedTextDataEntity},
		Message:    "Speech updated",
	})
}

// ==================== Service ==========================

type SavedTextCaseUpdateSpeechInput struct {
	Roles     []int
	SubjectId string
	GroupId   string
	*SavedTextCaseUpdateSpeechRequest
}

type SavedTextCaseUpdateSpeechOutput struct {
	*constant.SavedTextDataEntity
}

func (service *serviceStruct) SavedTextCaseUpdateSpeech(in *SavedTextCaseUpdateSpeechInput) (*SavedTextCaseUpdateSpeechOutput, error) {
	savedText, err := service.academicTranslationStorage.SavedTextGet(in.GroupId)
	if err != nil {
		return nil, err
	}

	curriculumGroupId := 0
	for _, value := range savedText.Translations {
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
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer tx.Rollback()
	objectToDelete := []string{}
	objectMap := map[string][]byte{}
	now := time.Now().UTC()
	if in.ThaiTextToAi != nil {
		_, ok := savedText.Translations[constant.Thai]
		if ok {
			thaiSpeechKey := uuid.NewString()
			bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(*in.ThaiTextToAi, constant.Thai)
			if err != nil {
				return nil, err
			}

			objectMap[thaiSpeechKey] = bytes
			if savedText.Translations[constant.Thai].SpeechUrl != nil {
				objectToDelete = append(objectToDelete, *savedText.Translations[constant.Thai].SpeechUrl)
			}

			thaiSavedText := savedText.Translations[constant.Thai]
			thaiSavedText.UpdatedAt = &now
			thaiSavedText.UpdatedBy = &in.SubjectId
			thaiSavedText.AdminLoginAs = in.AdminLoginAs
			thaiSavedText.TextToAi = in.ThaiTextToAi
			thaiSavedText.SpeechUrl = &thaiSpeechKey

			thaiSavedTextUpdateEntity := constant.SavedTextUpdateEntity{}
			err = copier.Copy(&thaiSavedTextUpdateEntity, &thaiSavedText)
			if err != nil {
				return nil, err
			}

			thai, err := service.academicTranslationStorage.SavedTextUpdate(tx, &thaiSavedTextUpdateEntity)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.Thai] = *thai
		}
	}

	if in.EnglishTextToAi != nil {
		_, ok := savedText.Translations[constant.English]
		if ok {
			englishSpeechKey := uuid.NewString()
			bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(*in.EnglishTextToAi, constant.English)
			if err != nil {
				return nil, err
			}
			objectMap[englishSpeechKey] = bytes
			if savedText.Translations[constant.English].SpeechUrl != nil {
				objectToDelete = append(objectToDelete, *savedText.Translations[constant.English].SpeechUrl)
			}

			englishSavedText := savedText.Translations[constant.English]
			englishSavedText.UpdatedAt = &now
			englishSavedText.UpdatedBy = &in.SubjectId
			englishSavedText.AdminLoginAs = in.AdminLoginAs
			englishSavedText.TextToAi = in.EnglishTextToAi
			englishSavedText.SpeechUrl = &englishSpeechKey

			englishSavedTextUpdateEntity := constant.SavedTextUpdateEntity{}
			err = copier.Copy(&englishSavedTextUpdateEntity, &englishSavedText)
			if err != nil {
				return nil, err
			}

			english, err := service.academicTranslationStorage.SavedTextUpdate(tx, &englishSavedTextUpdateEntity)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.English] = *english
		}
	}

	if in.ChineseTextToAi != nil {
		_, ok := savedText.Translations[constant.Chinese]
		if ok {
			chineseSpeechKey := uuid.NewString()
			bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(*in.ChineseTextToAi, constant.Chinese)
			if err != nil {
				return nil, err
			}
			objectMap[chineseSpeechKey] = bytes
			if savedText.Translations[constant.Chinese].SpeechUrl != nil {
				objectToDelete = append(objectToDelete, *savedText.Translations[constant.Chinese].SpeechUrl)
			}

			chineseSavedText := savedText.Translations[constant.Chinese]
			chineseSavedText.UpdatedAt = &now
			chineseSavedText.UpdatedBy = &in.SubjectId
			chineseSavedText.AdminLoginAs = in.AdminLoginAs
			chineseSavedText.TextToAi = in.ChineseTextToAi
			chineseSavedText.SpeechUrl = &chineseSpeechKey

			chineseSavedTextUpdateEntity := constant.SavedTextUpdateEntity{}
			err = copier.Copy(&chineseSavedTextUpdateEntity, &chineseSavedText)
			if err != nil {
				return nil, err
			}

			chinese, err := service.academicTranslationStorage.SavedTextUpdate(tx, &chineseSavedTextUpdateEntity)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.Chinese] = *chinese
		}
	}

	for key, value := range objectMap {
		err := service.cloudStorage.ObjectCreate(value, key, cloudStorageConstant.Speech)
		if err != nil {
			return nil, err
		}
	}

	for _, key := range objectToDelete {
		err := service.cloudStorage.ObjectDelete(key)
		if err != nil {
			return nil, err
		}
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

	return &SavedTextCaseUpdateSpeechOutput{
		savedText,
	}, nil
}
