package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// ==================== Request ==========================
type SavedTextCreateRequest struct {
	ThaiText    *string `form:"thai_text"`
	EnglishText *string `form:"english_text"`
	ChineseText *string `form:"chinese_text"`
	// SrcLanguage   *string  `form:"src_language"`
	// DestLanguages []string `form:"dest_languages"`
	AdminLoginAs *string `form:"admin_login_as"`
}

// ==================== Response ==========================

type SavedTextCreateResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       []constant.SavedTextDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCreate(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &SavedTextCreateRequest{})
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

	savedTextCreateOutput, err := api.Service.SavedTextCreate(&SavedTextCreateInput{
		Roles:                  roles,
		SubjectId:              subjectId,
		CurriculumGroupId:      curriculumGroupId,
		SavedTextCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SavedTextCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []constant.SavedTextDataEntity{
			*savedTextCreateOutput.SavedTextDataEntity,
		},
		Message: "Saved text created",
	})
}

// ==================== Service ==========================

type SavedTextCreateInput struct {
	Roles             []int
	SubjectId         string
	CurriculumGroupId int
	*SavedTextCreateRequest
}

type SavedTextCreateOutput struct {
	*constant.SavedTextDataEntity
}

func (service *serviceStruct) SavedTextCreate(in *SavedTextCreateInput) (*SavedTextCreateOutput, error) {
	savedText := map[string]constant.SavedTextEntity{}
	now := time.Now().UTC()
	groupId := uuid.NewString()

	tx, err := service.academicTranslationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	savedTextEntity := constant.SavedTextEntity{
		CurriculumGroupId: in.CurriculumGroupId,
		GroupId:           groupId,
		Status:            constant.SavedTextEnabled,
		CreatedAt:         now,
		CreatedBy:         in.SubjectId,
		AdminLoginAs:      in.AdminLoginAs,
	}

	// th
	if in.ThaiText != nil {
		savedTextEntity.Language = constant.Thai
		savedTextEntity.Text = in.ThaiText
		savedTextEntity.TextToAi = in.ThaiText

		thaiSavedText, err := service.academicTranslationStorage.SavedTextCreate(tx, &savedTextEntity)
		if err != nil {
			return nil, err
		}
		savedText[constant.Thai] = *thaiSavedText
	}

	// en
	if in.EnglishText != nil {
		savedTextEntity.Language = constant.English
		savedTextEntity.Text = in.EnglishText
		savedTextEntity.TextToAi = in.EnglishText

		englishSavedText, err := service.academicTranslationStorage.SavedTextCreate(tx, &savedTextEntity)
		if err != nil {
			return nil, err
		}
		savedText[constant.English] = *englishSavedText
	}

	// zh
	if in.ChineseText != nil {
		savedTextEntity.Language = constant.Chinese
		savedTextEntity.Text = in.ChineseText
		savedTextEntity.TextToAi = in.ChineseText

		chineseSavedText, err := service.academicTranslationStorage.SavedTextCreate(tx, &savedTextEntity)
		if err != nil {
			return nil, err
		}
		savedText[constant.Chinese] = *chineseSavedText
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SavedTextCreateOutput{
		&constant.SavedTextDataEntity{
			GroupId:      groupId,
			Translations: savedText,
		},
	}, nil
}
