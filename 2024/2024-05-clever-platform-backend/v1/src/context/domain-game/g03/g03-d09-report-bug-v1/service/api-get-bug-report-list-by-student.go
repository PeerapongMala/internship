package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d09-report-bug-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) BugList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.BugList(userId, pagination)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       data,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) BugList(userID string, pagination *helper.Pagination) ([]*constant.Bug, error) {
	bugs, err := service.reportBugStorage.BugList(userID, pagination)
	if err != nil {
		return nil, err
	}
	return bugs, nil
}
