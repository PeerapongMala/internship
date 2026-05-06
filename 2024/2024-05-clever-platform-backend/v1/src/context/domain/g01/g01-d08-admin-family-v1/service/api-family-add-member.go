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
type AddMemberRequest struct {
	UsersID  []string `json:"users_id"`
	FamilyID int      `json:"family_id" params:"family_id"`
}

func (api *APIStruct) AddMember(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AddMemberRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	member, err := helper.ParseAndValidateRequest(context, request, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.AddMember(member)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
	})
}

func (service *serviceStruct) AddMember(members *AddMemberRequest) error {
	tx, err := service.adminFamilyStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, userID := range members.UsersID {
		err = service.adminFamilyStorage.AddMember(tx, members.FamilyID, userID, false)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
