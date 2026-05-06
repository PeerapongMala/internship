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

type SavedTextUpdateRequest struct {
	ThaiText        *string `json:"thai_text"`
	EnglishText     *string `json:"english_text"`
	ChineseText     *string `json:"chinese_text"`
	ThaiTextToAi    *string `json:"thai_text_to_ai"`
	EnglishTextToAi *string `json:"english_text_to_ai"`
	ChineseTextToAi *string `json:"chinese_text_to_ai"`
	AdminLoginAs    *string `json:"admin_login_as"`
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

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	now := time.Now().UTC()

	if in.ThaiText != nil {
		_, ok := savedText.Translations[constant.Thai]
		if ok {
			thaiSavedText := savedText.Translations[constant.Thai]
			thaiSavedText.UpdatedAt = &now
			thaiSavedText.UpdatedBy = &in.SubjectId
			thaiSavedText.AdminLoginAs = in.AdminLoginAs
			thaiSavedText.Text = in.ThaiText

			thai, err := service.academicLevelStorage.SavedTextUpdate(tx, &thaiSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.Thai] = *thai
		} else {
			thaiSavedText := constant.SavedTextEntity{
				CurriculumGroupId: curriculumGroupId,
				GroupId:           in.GroupId,
				Language:          constant.Thai,
				Text:              in.ThaiText,
				TextToAi:          in.ThaiText,
				Status:            constant.SavedTextEnabled,
				CreatedAt:         time.Now().UTC(),
				CreatedBy:         in.SubjectId,
				AdminLoginAs:      in.AdminLoginAs,
			}
			thai, err := service.academicLevelStorage.SavedTextCreate(tx, &thaiSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.Thai] = *thai
		}
	}
	if in.ThaiTextToAi != nil {
		_, ok := savedText.Translations[constant.Thai]
		if ok {
			thaiSavedText := savedText.Translations[constant.Thai]
			thaiSavedText.UpdatedAt = &now
			thaiSavedText.UpdatedBy = &in.SubjectId
			thaiSavedText.AdminLoginAs = in.AdminLoginAs
			thaiSavedText.TextToAi = in.ThaiTextToAi

			thai, err := service.academicLevelStorage.SavedTextUpdate(tx, &thaiSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.Thai] = *thai
		}
	}

	if in.EnglishText != nil {
		_, ok := savedText.Translations[constant.English]
		if ok {
			englishSavedText := savedText.Translations[constant.English]
			englishSavedText.UpdatedAt = &now
			englishSavedText.UpdatedBy = &in.SubjectId
			englishSavedText.AdminLoginAs = in.AdminLoginAs
			englishSavedText.Text = in.EnglishText

			english, err := service.academicLevelStorage.SavedTextUpdate(tx, &englishSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.English] = *english
		} else {
			englishSavedText := constant.SavedTextEntity{
				CurriculumGroupId: curriculumGroupId,
				GroupId:           in.GroupId,
				Language:          constant.English,
				Text:              in.EnglishText,
				TextToAi:          in.EnglishText,
				Status:            constant.SavedTextEnabled,
				CreatedAt:         time.Now().UTC(),
				CreatedBy:         in.SubjectId,
				AdminLoginAs:      in.AdminLoginAs,
			}
			english, err := service.academicLevelStorage.SavedTextCreate(tx, &englishSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.English] = *english
		}
	}
	if in.EnglishTextToAi != nil {
		_, ok := savedText.Translations[constant.English]
		if ok {
			englishSavedText := savedText.Translations[constant.English]
			englishSavedText.UpdatedAt = &now
			englishSavedText.UpdatedBy = &in.SubjectId
			englishSavedText.AdminLoginAs = in.AdminLoginAs
			englishSavedText.TextToAi = in.EnglishTextToAi

			english, err := service.academicLevelStorage.SavedTextUpdate(tx, &englishSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.English] = *english
		}
	}

	if in.ChineseText != nil {
		_, ok := savedText.Translations[constant.Chinese]
		if ok {
			chineseSavedText := savedText.Translations[constant.Chinese]
			chineseSavedText.UpdatedAt = &now
			chineseSavedText.UpdatedBy = &in.SubjectId
			chineseSavedText.AdminLoginAs = in.AdminLoginAs
			chineseSavedText.Text = in.ChineseText

			chinese, err := service.academicLevelStorage.SavedTextUpdate(tx, &chineseSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.Chinese] = *chinese
		} else {
			chineseSavedText := constant.SavedTextEntity{
				CurriculumGroupId: curriculumGroupId,
				GroupId:           in.GroupId,
				Language:          constant.Chinese,
				Text:              in.ChineseText,
				TextToAi:          in.ChineseText,
				Status:            constant.SavedTextEnabled,
				CreatedAt:         time.Now().UTC(),
				CreatedBy:         in.SubjectId,
				AdminLoginAs:      in.AdminLoginAs,
			}
			chinese, err := service.academicLevelStorage.SavedTextCreate(tx, &chineseSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.Chinese] = *chinese
		}
	}
	if in.ChineseTextToAi != nil {
		_, ok := savedText.Translations[constant.Chinese]
		if ok {
			chineseSavedText := savedText.Translations[constant.Chinese]
			chineseSavedText.UpdatedAt = &now
			chineseSavedText.UpdatedBy = &in.SubjectId
			chineseSavedText.AdminLoginAs = in.AdminLoginAs
			chineseSavedText.TextToAi = in.ChineseTextToAi

			chinese, err := service.academicLevelStorage.SavedTextUpdate(tx, &chineseSavedText)
			if err != nil {
				return nil, err
			}
			savedText.Translations[constant.Chinese] = *chinese
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

	return &SavedTextUpdateOutput{
		savedText,
	}, nil
}
