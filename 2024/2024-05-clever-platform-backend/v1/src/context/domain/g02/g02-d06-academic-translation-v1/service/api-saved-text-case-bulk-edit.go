package service

import (
	"github.com/google/uuid"
	"log"
	"net/http"
	"time"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SavedTextCaseBulkEditRequest struct {
	BulkEditList []constant.SavedTextBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
	AdminLoginAs *string                          `json:"admin_login_as"`
}

// ==================== Response ==========================

type SavedTextBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SavedTextCaseBulkEditRequest{})
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

	err = api.Service.SavedTextCaseBulkEdit(&SavedTextBulkEditInput{
		Roles:                        roles,
		SubjectId:                    subjectId,
		SavedTextCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Updated",
	})
}

// ==================== Service ==========================

type SavedTextBulkEditInput struct {
	Roles     []int
	SubjectId string
	*SavedTextCaseBulkEditRequest
}

func (service *serviceStruct) SavedTextCaseBulkEdit(in *SavedTextBulkEditInput) error {
	tx, err := service.academicTranslationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	keyToDelete := []string{}
	SpeechToAdd := map[string][]byte{}

	for _, bulkEditItem := range in.BulkEditList {
		savedText, err := service.academicTranslationStorage.SavedTextCaseGetByGroupLanguage(bulkEditItem.GroupId, bulkEditItem.Language)
		if err != nil {
			return err
		}

		savedTextUpdateEntity := constant.SavedTextUpdateEntity{}
		err = copier.Copy(&savedTextUpdateEntity, savedText)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		savedTextUpdateEntity.Status = bulkEditItem.Status
		now := time.Now().UTC()
		savedTextUpdateEntity.UpdatedAt = &now
		savedTextUpdateEntity.UpdatedBy = &in.SubjectId
		savedTextUpdateEntity.AdminLoginAs = in.AdminLoginAs

		if *bulkEditItem.Sound == false {
			if savedText.SpeechUrl != nil {
				keyToDelete = append(keyToDelete, *savedText.SpeechUrl)
				savedTextUpdateEntity.SpeechUrl = ""
			}
			err = service.academicTranslationStorage.SavedTextCaseDeleteSpeech(tx, savedTextUpdateEntity.Id)
			if err != nil {
				return err
			}
		}
		if *bulkEditItem.Sound == true {
			if savedText.SpeechUrl == nil {
				if savedText.TextToAi != nil {
					key := uuid.NewString()
					bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(*savedText.TextToAi, savedText.Language)
					if err != nil {
						return err
					}
					SpeechToAdd[key] = bytes
					savedTextUpdateEntity.SpeechUrl = key
				}
			}
		}

		_, err = service.academicTranslationStorage.SavedTextUpdate(tx, &savedTextUpdateEntity)
		if err != nil {
			return err
		}

		subLessonIds, err := service.academicLevelStorage.SavedTextCaseGetSubLessonId(tx, bulkEditItem.GroupId)
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
		return err
	}

	for _, key := range keyToDelete {
		err := service.cloudStorage.ObjectDelete(key)
		if err != nil {
			return err
		}
	}

	for key, value := range SpeechToAdd {
		err := service.cloudStorage.ObjectCreate(value, key, cloudStorageConstant.Speech)
		if err != nil {
			return err
		}
	}

	return nil
}
