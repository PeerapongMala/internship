package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"slices"
	"time"
)

// ==================== Request ==========================

type SubCriteriaTopicCaseBulkEditRequest struct {
	BulkEditList []constant.SubCriteriaTopicBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
	AdminLoginAs *string                                 `json:"admin_login_as"`
}

// ==================== Response ==========================

type SubCriteriaTopicCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubCriteriaTopicCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubCriteriaTopicCaseBulkEditRequest{})
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

	err = api.Service.SubCriteriaTopicCaseBulkEdit(&SubCriteriaTopicCaseBulkEditInput{
		Roles:                               roles,
		SubjectId:                           subjectId,
		SubCriteriaTopicCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubCriteriaTopicCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type SubCriteriaTopicCaseBulkEditInput struct {
	Roles     []int
	SubjectId string
	*SubCriteriaTopicCaseBulkEditRequest
}

func (service *serviceStruct) SubCriteriaTopicCaseBulkEdit(in *SubCriteriaTopicCaseBulkEditInput) error {
	tx, err := service.repositoryStorage.BeginTx()
	if err != nil {
		return nil
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		curriculumGroupId, err := service.repositoryStorage.SubCriteriaTopicCaseGetCurriculumGroupId(bulkEditItem.SubCriteriaTopicId)
		if err != nil {
			return err
		}

		contentCreators, err := service.repositoryStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
		if err != nil {
			return err
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
				return helper.NewHttpError(http.StatusForbidden, &msg)
			}
		}

		now := time.Now().UTC()
		subCriteriaTopicEntity := constant.SubCriteriaTopicEntity{
			Id:           bulkEditItem.SubCriteriaTopicId,
			Status:       bulkEditItem.Status,
			UpdatedAt:    &now,
			UpdatedBy:    &in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		}

		err = service.repositoryStorage.SubCriteriaTopicCaseBulkUpdate(tx, &subCriteriaTopicEntity)
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
