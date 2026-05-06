package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================
type FamilyDeleteRequest struct {
	FamilyID int    `json:"family_id"`
	Password string `json:"password"`
}

func (api *APIStruct) FamilyDelete(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &FamilyDeleteRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	ok, err = api.Service.ValidatePassword(subjectId, request.Password)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}
	if !ok {
		msg := "Password isn't correct"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &msg))
	}

	err = api.Service.FamilyDelete(request.FamilyID)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Delete Success",
	})
}

func (service *serviceStruct) FamilyDelete(familyID int) error {
	tx, err := service.adminFamilyStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.adminFamilyStorage.FamilyDelete(tx, familyID)
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
