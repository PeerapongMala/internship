package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"slices"
	"time"
)

// ==================== Request ==========================

type PlatformCaseBulkEditRequest struct {
	BulkEditList []constant.PlatformBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
	AdminLoginAs *string                         `json:"admin_login_as"`
}

// ==================== Response ==========================

type PlatformCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) PlatformCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &PlatformCaseBulkEditRequest{})
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

	err = api.Service.PlatformCaseBulkEdit(&PlatformCaseBulkEditInput{
		Roles:                       roles,
		SubjectId:                   subjectId,
		PlatformCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(PlatformCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type PlatformCaseBulkEditInput struct {
	Roles     []int
	SubjectId string
	*PlatformCaseBulkEditRequest
}

func (service *serviceStruct) PlatformCaseBulkEdit(in *PlatformCaseBulkEditInput) error {
	tx, err := service.academicCourseStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		curriculumGroupId, err := service.academicCourseStorage.PlatformCaseGetCurriculumGroupId(bulkEditItem.PlatformId)
		if err != nil {
			return err
		}
		contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
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
		platformEntity := constant.PlatformEntity{
			Id:           bulkEditItem.PlatformId,
			Status:       bulkEditItem.Status,
			UpdatedAt:    &now,
			UpdatedBy:    &in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		}

		_, err = service.academicCourseStorage.PlatformUpdate(tx, &platformEntity)
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
