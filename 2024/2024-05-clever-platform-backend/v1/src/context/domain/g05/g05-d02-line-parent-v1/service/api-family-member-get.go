package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) MemberInFamily(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.MemberInFamily(subjectId)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.DataResponse{
		StatusCode: http.StatusOK,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) MemberInFamily(userID string) (*constant.FamilyMembers, error) {
	data, err := service.lineParentStorage.MemberInFamily(userID)
	if err != nil {
		return nil, err
	}
	return data, nil
}
