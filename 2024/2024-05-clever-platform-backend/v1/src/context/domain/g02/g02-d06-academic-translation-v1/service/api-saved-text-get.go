package service

import (
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SavedTextGetResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       []constant.SavedTextDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextGet(context *fiber.Ctx) error {
	groupId := context.Params("groupId")

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	savedTextGetOutput, err := api.Service.SavedTextGet(&SavedTextGetInput{
		Roles:     roles,
		SubjectId: subjectId,
		GroupId:   groupId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SavedTextDataEntity{*savedTextGetOutput.SavedTextDataEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SavedTextGetInput struct {
	Roles     []int
	SubjectId string
	GroupId   string
}

type SavedTextGetOutput struct {
	*constant.SavedTextDataEntity
}

func (service *serviceStruct) SavedTextGet(in *SavedTextGetInput) (*SavedTextGetOutput, error) {
	savedTextData, err := service.academicTranslationStorage.SavedTextGet(in.GroupId)
	if err != nil {
		return nil, err
	}

	curriculumGroupId := 0
	for _, value := range savedTextData.Translations {
		if value.CurriculumGroupId != 0 {
			curriculumGroupId = value.CurriculumGroupId
		}
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

	for _, translation := range savedTextData.Translations {
		if translation.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*translation.SpeechUrl)
			if err != nil {
				return nil, err
			}
			translation.SpeechUrl = url
			savedTextData.Translations[translation.Language] = translation
		}
	}

	return &SavedTextGetOutput{
		SavedTextDataEntity: savedTextData,
	}, nil
}
