package service

import (
	"database/sql"
	"log"
	"net/http"
	"slices"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SavedTextUpdateRequest struct {
	ThaiText     *string `json:"thai_text"`
	EnglishText  *string `json:"english_text"`
	ChineseText  *string `json:"chinese_text"`
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type SavedTextUpdateResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       []constant.SavedTextDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextUpdate(context *fiber.Ctx) error {
	groupId := context.Params("groupId")

	request, err := helper.ParseAndValidateRequest(context, &SavedTextUpdateRequest{})
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

	savedTextUpdateOutput, err := api.Service.SavedTextUpdate(&SavedTextUpdateInput{
		Roles:                  roles,
		SubjectId:              subjectId,
		GroupId:                groupId,
		SavedTextUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SavedTextDataEntity{*savedTextUpdateOutput.SavedTextDataEntity},
		Message:    "Saved Text updated",
	})
}

// ==================== Service ==========================

type SavedTextUpdateInput struct {
	Roles     []int
	SubjectId string
	GroupId   string
	*SavedTextUpdateRequest
}

type SavedTextUpdateOutput struct {
	*constant.SavedTextDataEntity
}

func (service *serviceStruct) SavedTextUpdate(in *SavedTextUpdateInput) (*SavedTextUpdateOutput, error) {
	savedTextList, err := service.academicTranslationStorage.SavedTextCaseGetByGroupId(in.GroupId)
	if err != nil {
		return nil, err
	}

	curriculumGroupId := 0
	for _, value := range savedTextList.Translations {
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

	textList := map[string]string{}
	if in.ThaiText != nil {
		textList[constant.Thai] = *in.ThaiText
	}
	if in.EnglishText != nil {
		textList[constant.English] = *in.EnglishText
	}
	if in.ChineseText != nil {
		textList[constant.Chinese] = *in.ChineseText
	}

	for language, textItem := range textList {
		savedText, err := service.academicTranslationStorage.SavedTextCaseGetByGroupLanguage(in.GroupId, language)
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}

		if savedText == nil {
			newText, err := service.academicTranslationStorage.SavedTextCreate(tx, &constant.SavedTextEntity{
				CurriculumGroupId: curriculumGroupId,
				GroupId:           in.GroupId,
				Language:          language,
				Text:              &textItem,
				TextToAi:          &textItem,
				Status:            constant.SavedTextEnabled,
				CreatedAt:         time.Now().UTC(),
				CreatedBy:         in.SubjectId,
				AdminLoginAs:      in.AdminLoginAs,
			})
			if err != nil {
				return nil, err
			}
			savedTextList.Translations[language] = *newText
		} else {
			now := time.Now().UTC()
			_, err := service.academicTranslationStorage.SavedTextUpdate(tx, &constant.SavedTextUpdateEntity{
				Id:           savedText.Id,
				GroupId:      in.GroupId,
				Text:         &textItem,
				UpdatedAt:    &now,
				UpdatedBy:    &in.SubjectId,
				AdminLoginAs: in.AdminLoginAs,
			})
			if err != nil {
				return nil, err
			}
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

	for _, savedTextEntity := range savedTextList.Translations {
		if savedTextEntity.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*savedTextEntity.SpeechUrl)
			if err != nil {
				return nil, err
			}
			savedTextEntity.SpeechUrl = url
			savedTextList.Translations[savedTextEntity.Language] = savedTextEntity
		}
	}

	return &SavedTextUpdateOutput{
		savedTextList,
	}, nil
}
