package service

import (
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) FamilyUpdateStatus(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.Family{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UpdatedBy = subjectId
	request.UpdatedAt = time.Now().UTC()

	err = api.Service.FamilyUpdateStatus(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Update success",
	})
}

func (service *serviceStruct) FamilyUpdateStatus(family *constant.Family) error {
	err := service.adminFamilyStorage.FamilyArchive(nil, family)
	if err != nil {
		return err
	}

	return nil
}
