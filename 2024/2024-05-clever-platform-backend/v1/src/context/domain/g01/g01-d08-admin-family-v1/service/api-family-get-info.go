package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) FamilyGetInfo(context *fiber.Ctx) error {
	familyIDStr := context.Params("family_id")
	familyID, err := strconv.Atoi(familyIDStr)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	data, err := api.Service.FamilyGetInfo(familyID)
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

func (service *serviceStruct) FamilyGetInfo(familyID int) (*constant.FamilyResponse, error) {
	family, err := service.adminFamilyStorage.FamilyGet(familyID)
	if err != nil {
		return nil, err
	}
	return family, nil
}
