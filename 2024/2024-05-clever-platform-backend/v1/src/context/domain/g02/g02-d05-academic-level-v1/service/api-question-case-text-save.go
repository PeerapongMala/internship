package service

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type QuestionCaseTextSaveRequest struct {
	Text []TextSaveData `json:"text" validate:"required"`
}

type TextSaveData struct {
	SavedTextGroupId string  `json:"saved_text_group_id" validate:"required"`
	ThaiText         *string `json:"thai_text"`
	EnglishText      *string `json:"english_text"`
	ChineseText      *string `json:"chinese_text"`
	AdminLoginAs     *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type QuestionCaseTextSaveResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionCaseTextSave(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionCaseTextSaveRequest{})
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

	err = api.Service.QuestionCaseTextSave(&QuestionCaseTextSaveInput{
		SubjectId:                   subjectId,
		Roles:                       roles,
		QuestionCaseTextSaveRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionCaseTextSaveResponse{
		StatusCode: http.StatusOK,
		Message:    "Saved",
	})
}

// ==================== Service ==========================

type QuestionCaseTextSaveInput struct {
	SubjectId string
	Roles     []int
	*QuestionCaseTextSaveRequest
}

func (service *serviceStruct) QuestionCaseTextSave(in *QuestionCaseTextSaveInput) error {

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, text := range in.Text {
		textToAiList := map[string]string{}
		savedText, err := service.academicLevelStorage.SavedTextCaseGetByGroupId(text.SavedTextGroupId)
		if err != nil {
			return err
		}

		var curriculumGroupId int
		for _, translation := range savedText.Translations {
			if translation.TextToAi != nil {
				textToAiList[translation.Language] = *translation.TextToAi
			}
			curriculumGroupId = translation.CurriculumGroupId
		}

		err = service.CheckContentCreator(&CheckContentCreatorInput{
			SubjectId:         in.SubjectId,
			Roles:             in.Roles,
			CurriculumGroupId: curriculumGroupId,
		})
		if err != nil {
			return err
		}

		textList := map[string]string{}
		if text.ThaiText != nil {
			textList[constant.Thai] = *text.ThaiText
		}
		if text.EnglishText != nil {
			textList[constant.English] = *text.EnglishText
		}
		if text.ChineseText != nil {
			textList[constant.Chinese] = *text.ChineseText
		}

		for language, textItem := range textList {
			savedText, err := service.academicLevelStorage.SavedTextCaseGetByGroupLanguage(nil, text.SavedTextGroupId, language)
			if err != nil && !errors.Is(err, sql.ErrNoRows) {
				return err
			}

			if savedText == nil {
				_, err := service.academicLevelStorage.SavedTextCreate(tx, &constant.SavedTextEntity{
					CurriculumGroupId: curriculumGroupId,
					GroupId:           text.SavedTextGroupId,
					Language:          language,
					Text:              &textItem,
					TextToAi:          &textItem,
					Status:            constant.Enabled,
					CreatedAt:         time.Now().UTC(),
					CreatedBy:         in.SubjectId,
					AdminLoginAs:      text.AdminLoginAs,
				})
				if err != nil {
					return err
				}
			} else {
				savedText.Text = &textItem
				if savedText.TextToAi == nil {
					textToAi := textToAiList[language]
					savedText.TextToAi = &textToAi
				}
				savedText.TextToAi = &textItem
				now := time.Now().UTC()
				savedText.UpdatedAt = &now
				savedText.UpdatedBy = &in.SubjectId
				savedText.AdminLoginAs = text.AdminLoginAs
				_, err = service.academicLevelStorage.SavedTextUpdate(tx, savedText)
				if err != nil {
					return err
				}
			}
		}

		subLessonIds, err := service.academicLevelStorage.SavedTextCaseGetSubLessonId(tx, text.SavedTextGroupId)
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
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
