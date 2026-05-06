package service

import (
	"fmt"
	"log"
	"net/http"
	"slices"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SaveTextCaseUpdateStatusRequest struct {
	Language     string  `json:"language" validate:"required"`
	Status       string  `json:"status" validate:"required"`
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type SavedTextCaseUpdateStatusResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCaseUpdateStatus(context *fiber.Ctx) error {
	groupId := context.Params("groupId")
	request, err := helper.ParseAndValidateRequest(context, &SaveTextCaseUpdateStatusRequest{})
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

	_, err = api.Service.SavedTextCaseUpdateStatus(&SavedTextCaseUpdateStatusInput{
		Roles:                           roles,
		SubjectId:                       subjectId,
		GroupId:                         groupId,
		SaveTextCaseUpdateStatusRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextCaseUpdateStatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Status updated",
	})
}

// ==================== Service ==========================

type SavedTextCaseUpdateStatusInput struct {
	Roles     []int
	SubjectId string
	GroupId   string
	*SaveTextCaseUpdateStatusRequest
}

type SavedTextCaseUpdateStatusOutput struct {
	*constant.SavedTextEntity
}

func (service *serviceStruct) SavedTextCaseUpdateStatus(in *SavedTextCaseUpdateStatusInput) (*SavedTextCaseUpdateStatusOutput, error) {
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

	savedText, ok := savedTextData.Translations[in.Language]
	if !ok {
		msg := fmt.Sprintf(`Saved text of language %s not found`, in.Language)
		err := helper.NewHttpError(http.StatusConflict, &msg)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	savedTextUpdateEntity := constant.SavedTextUpdateEntity{}
	err = copier.Copy(&savedTextUpdateEntity, savedText)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	savedTextUpdateEntity.Status = in.Status
	now := time.Now().UTC()
	savedTextUpdateEntity.UpdatedAt = &now
	savedTextUpdateEntity.UpdatedBy = &in.SubjectId
	savedTextUpdateEntity.AdminLoginAs = in.AdminLoginAs

	updatedSavedText, err := service.academicTranslationStorage.SavedTextUpdate(nil, &savedTextUpdateEntity)
	if err != nil {
		return nil, err
	}

	return &SavedTextCaseUpdateStatusOutput{
		updatedSavedText,
	}, nil
}
