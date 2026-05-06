package service

import (
	"log"
	"net/http"
	"slices"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type IndicatorCaseBulkEditRequest struct {
	BulkEditList []constant.IndicatorBulkEditItem `json:"bulk_edit_list" validate:"required"`
	AdminLoginAs *string                          `json:"admin_login_as"`
}

// ==================== Response ==========================

type IndicatorCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) IndicatorCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &IndicatorCaseBulkEditRequest{})
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

	err = api.Service.IndicatorCaseBulkEdit(&IndicatorCaseBulkEditInput{
		Roles:                        roles,
		SubjectId:                    subjectId,
		IndicatorCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(IndicatorCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})

}

// ==================== Service ==========================

type IndicatorCaseBulkEditInput struct {
	Roles     []int
	SubjectId string
	*IndicatorCaseBulkEditRequest
}

func (service *serviceStruct) IndicatorCaseBulkEdit(in *IndicatorCaseBulkEditInput) error {
	tx, err := service.repositoryStorage.BeginTx()
	if err != nil {
		return nil
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		curriculumGroupId, err := service.repositoryStorage.IndicatorCaseGetCurriculumGroupId(bulkEditItem.IndicatorId)
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
		indicatorEntity := constant.IndicatorEntity{
			Id:           bulkEditItem.IndicatorId,
			Status:       bulkEditItem.Status,
			UpdatedAt:    &now,
			UpdatedBy:    &in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		}

		_, err = service.repositoryStorage.IndicatorCaseBulkUpdate(tx, &indicatorEntity)
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
