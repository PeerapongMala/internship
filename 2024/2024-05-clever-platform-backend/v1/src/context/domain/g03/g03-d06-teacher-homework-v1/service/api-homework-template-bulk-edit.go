package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type HomeworkTemplateBulkEditRequest struct {
	BulkEditList []constant.HomeworkTemplateEntity `json:"bulk_edit_list" validate:"required"`
	UserId       string
}

// ==================== Response ==========================
type HomeworkTemplateBulkEditResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkTemplateBulkEdit(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkTemplateBulkEditRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserId = userId
	err = api.Service.HomeworkTemplateBulkEdit(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkTemplateBulkEditResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkTemplateBulkEdit(in *HomeworkTemplateBulkEditRequest) error {

	sqlTx, err := service.teacherHomeworkStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	now := time.Now().UTC()
	for _, HomeworkTemplate := range in.BulkEditList {
		HomeworkTemplate.UpdatedAt = &now
		HomeworkTemplate.UpdatedBy = &in.UserId
		HomeworkTemplate.TeacherId = &in.UserId
	
		err = service.teacherHomeworkStorage.UpdateHomeworkTemplate(sqlTx, &HomeworkTemplate)
		if err != nil {
			return err
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
