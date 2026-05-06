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
type HomeworkBulkEditRequest struct {
	BulkEditList []constant.HomeworkEntity `json:"bulk_edit_list" validate:"required"`
	UserId       string
}

// ==================== Response ==========================
type HomeworkBulkEditResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkBulkEdit(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkBulkEditRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserId = userId
	err = api.Service.HomeworkBulkEdit(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkBulkEditResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkBulkEdit(in *HomeworkBulkEditRequest) error {

	sqlTx, err := service.teacherHomeworkStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	now := time.Now().UTC()
	for _, homework := range in.BulkEditList {
		homework.UpdatedAt = &now
		homework.UpdatedBy = &in.UserId

		err = service.teacherHomeworkStorage.UpdateHomework(sqlTx, &homework)
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
