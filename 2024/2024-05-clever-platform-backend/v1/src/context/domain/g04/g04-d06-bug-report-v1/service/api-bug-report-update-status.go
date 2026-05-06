package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================
func (api *APIStruct) UpdateBugStatus(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.BugLog{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.CreatedBy = subjectId
	request.CreatedAt = time.Now().UTC()

	err = api.Service.UpdateBugStatus(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Update status success",
	})
}

func (service *serviceStruct) UpdateBugStatus(bugLog *constant.BugLog) error {
	tx, err := service.bugReportStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.bugReportStorage.UpdateBugStatus(tx, bugLog)
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
