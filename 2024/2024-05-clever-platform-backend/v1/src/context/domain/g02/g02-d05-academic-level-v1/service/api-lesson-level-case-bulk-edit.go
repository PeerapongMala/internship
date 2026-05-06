package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type LessonLevelCaseBulkEditRequest struct {
	Password     string                                 `json:"password" validate:"required"`
	BulkEditList []constant.LessonLevelCaseBulkEditItem `json:"bulk_edit_list" validate:"required"`
	AdminLoginAs *string                                `json:"admin_login_as"`
}

// ==================== Response ==========================

type LessonLevelCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonLevelCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonLevelCaseBulkEditRequest{})
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

	err = api.Service.LessonLevelCaseBulkEdit(&LessonLevelCaseBulkEditInput{
		Roles:                          roles,
		SubjectId:                      subjectId,
		LessonLevelCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonLevelCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type LessonLevelCaseBulkEditInput struct {
	Roles     []int
	SubjectId string
	*LessonLevelCaseBulkEditRequest
}

func (service *serviceStruct) LessonLevelCaseBulkEdit(in *LessonLevelCaseBulkEditInput) error {
	authEmailPassword, err := service.academicLevelStorage.AuthEmailPasswordGet(in.SubjectId)
	if err != nil {
		return err
	}

	isMatched := helper.ValidatePassword(authEmailPassword.PasswordHash, in.Password)
	if !isMatched {
		return helper.NewHttpError(http.StatusForbidden, nil)
	}

	for _, bulkEditItem := range in.BulkEditList {
		if bulkEditItem.Status != constant.Enabled {
			return helper.NewHttpError(http.StatusBadRequest, helper.ToPtr("invalid status"))
		}
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	subLessonIds := []int{}
	for _, bulkEditItem := range in.BulkEditList {
		curriculumGroupId, err := service.academicLevelStorage.LessonCaseGetCurriculumGroupId(bulkEditItem.LessonId)
		if err != nil {
			return err
		}

		err = service.CheckContentCreator(&CheckContentCreatorInput{
			SubjectId:         in.SubjectId,
			Roles:             in.Roles,
			CurriculumGroupId: *curriculumGroupId,
		})
		if err != nil {
			return err
		}

		err = service.academicLevelStorage.LessonLevelCaseBulkEdit(tx, []int{bulkEditItem.LessonId}, constant.Enabled, in.SubjectId)
		if err != nil {
			return err
		}

		ids, err := service.academicLevelStorage.LessonCaseListSubLesson(tx, []int{bulkEditItem.LessonId})
		if err != nil {
			return err
		}
		subLessonIds = append(subLessonIds, ids...)
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, subLessonIds, false, in.SubjectId)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
