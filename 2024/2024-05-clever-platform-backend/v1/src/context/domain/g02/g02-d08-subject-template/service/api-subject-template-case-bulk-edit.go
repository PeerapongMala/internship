package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type SubjectTemplateCaseBulkEditRequest struct {
	BulkEditList []constant.SubjectTemplateBulkEditItem `json:"bulk_edit_list" validate:"required,dive"`
}

// ==================== Response ==========================

type SubjectTemplateCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectTemplateCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectTemplateCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SubjectTemplateCaseBulkEdit(&SubjectTemplateCaseBulkEditInput{
		SubjectId:                          subjectId,
		SubjectTemplateCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectTemplateCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type SubjectTemplateCaseBulkEditInput struct {
	SubjectId string
	*SubjectTemplateCaseBulkEditRequest
}

func (service *serviceStruct) SubjectTemplateCaseBulkEdit(in *SubjectTemplateCaseBulkEditInput) error {
	tx, err := service.subjectTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	m := map[string][]int{}
	for _, bulkEditItem := range in.BulkEditList {
		m[bulkEditItem.Status] = append(m[bulkEditItem.Status], bulkEditItem.Id)
	}

	err = service.subjectTemplateStorage.SubjectTemplateCaseBulkEdit(tx, m)
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
