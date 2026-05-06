package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"slices"
	"time"
)

// ==================== Request ==========================

type LessonCaseBulkEditRequest struct {
	BulkEditList []constant.LessonBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
	AdminLoginAs *string                       `json:"admin_login_as"`
}

// ==================== Response ==========================

type LessonCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonCaseBulkEditRequest{})
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

	err = api.Service.LessonCaseBulkEdit(&LessonCaseBulkEditInput{
		Roles:                     roles,
		SubjectId:                 subjectId,
		LessonCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type LessonCaseBulkEditInput struct {
	Roles     []int
	SubjectId string
	*LessonCaseBulkEditRequest
}

func (service *serviceStruct) LessonCaseBulkEdit(in *LessonCaseBulkEditInput) error {
	tx, err := service.academicLessonStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, bulkEditItem := range in.BulkEditList {
		curriculumGroupId, err := service.academicLessonStorage.LessonCaseGetCurriculumGroupId(bulkEditItem.LessonId)
		if err != nil {
			return err
		}

		contentCreators, err := service.academicLessonStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
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
		lessonEntity := constant.LessonEntity{
			Id:           bulkEditItem.LessonId,
			Status:       bulkEditItem.Status,
			UpdatedAt:    &now,
			UpdatedBy:    &in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		}

		_, err = service.academicLessonStorage.LessonUpdate(tx, &lessonEntity)
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
