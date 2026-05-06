package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"slices"
	"time"
)

// ==================== Request ==========================

type SubLessonCaseBulkEditRequest struct {
	BulkEditList []constant.SubLessonBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
	AdminLoginAs *string                          `json:"admin_login_as"`
}

// ==================== Response ==========================

type SubLessonCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubLessonCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))

	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SubLessonCaseBulkEdit(&SubLessonCaseBulkEditInput{
		Roles:                        roles,
		SubjectId:                    subjectId,
		SubLessonCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type SubLessonCaseBulkEditInput struct {
	Roles     []int
	SubjectId string
	*SubLessonCaseBulkEditRequest
}

func (service *serviceStruct) SubLessonCaseBulkEdit(in *SubLessonCaseBulkEditInput) error {
	tx, err := service.academicSubLessonStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		curriculumGroupId, err := service.academicSubLessonStorage.SubLessonCaseGetCurriculumGroupId(bulkEditItem.SubLessonId)
		if err != nil {
			return err
		}

		contentCreators, err := service.academicSubLessonStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
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
		lessonEntity := constant.SubLessonEntity{
			Id:           bulkEditItem.SubLessonId,
			Status:       bulkEditItem.Status,
			UpdatedAt:    &now,
			UpdatedBy:    &in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		}

		_, err = service.academicSubLessonStorage.SubLessonUpdate(tx, &lessonEntity)
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
