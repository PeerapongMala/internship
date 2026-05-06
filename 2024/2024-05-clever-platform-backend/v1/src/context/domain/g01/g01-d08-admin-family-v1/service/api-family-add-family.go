package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================
type FamilyRequest struct {
	FamilyID  int
	Users     []UserOwner `json:"users"`
	CreatedAt time.Time
	CreatedBy string
	Status    string `json:"status"`
}

type UserOwner struct {
	UserID  string `json:"user_id"`
	IsOwner bool   `json:"is_owner"`
}

func (api *APIStruct) AddFamily(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &FamilyRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.CreatedBy = subjectId
	request.CreatedAt = time.Now().UTC()

	err = api.Service.AddFamily(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Add Family Success",
	})
}

func (service *serviceStruct) AddFamily(req *FamilyRequest) error {
	tx, err := service.adminFamilyStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	family := &constant.Family{
		CreatedAt: req.CreatedAt,
		CreatedBy: req.CreatedBy,
		Status:    req.Status,
	}

	familyID, err := service.adminFamilyStorage.AddFamily(tx, family)

	for _, user := range req.Users {
		err = service.adminFamilyStorage.AddMember(tx, familyID, user.UserID, user.IsOwner)
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
