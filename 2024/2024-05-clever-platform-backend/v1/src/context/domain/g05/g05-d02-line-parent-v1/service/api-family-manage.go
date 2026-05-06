package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	familyConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================
func (api *APIStruct) ManageFamily(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.Family{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if request.ManageFamily == "create" {
		subjectId, ok := context.Locals("subjectId").(string)
		if !ok {
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
		}
		request.CreatedBy = subjectId
		request.Users = append(request.Users, constant.User{UserID: subjectId, Task: "add"})
		request.CreatedAt = time.Now().UTC()
	}

	err = api.Service.ManageFamily(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))

	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) ManageFamily(family *constant.Family) error {
	tx, err := service.lineParentStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	switch family.ManageFamily {
	case "create":
		familyEntity := familyConstant.Family{
			Status:    "enabled",
			CreatedAt: family.CreatedAt,
			CreatedBy: family.CreatedBy,
		}

		exist, err := service.lineParentStorage.CheckMemberNotExist(family.CreatedBy)
		if err != nil {
			return err
		} else if *exist == false {
			return fmt.Errorf("You already belong to a family.")
		}

		if family.FamilyID, err = service.familyStorage.AddFamily(tx, &familyEntity); err != nil {
			return err
		}

		if err := service.processUsers(tx, family); err != nil {
			return err
		}

	case "delete":
		if err := service.lineParentStorage.DeleteFamily(tx, family.FamilyID); err != nil {
			return err
		}

	case "manage":
		if err := service.processUsers(tx, family); err != nil {
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

func (service *serviceStruct) processUsers(tx *sqlx.Tx, family *constant.Family) error {
	for _, user := range family.Users {
		switch user.Task {
		case "add":
			if err := service.familyStorage.AddMember(tx, family.FamilyID, user.UserID, user.UserID == family.CreatedBy); err != nil {
				return err
			}

		case "delete":
			isOwner, err := service.lineParentStorage.CheckOwner(user.UserID)
			if err != nil || (isOwner != nil && *isOwner) {
				return fmt.Errorf("can't delete user %s", user.UserID)
			}
			if err := service.familyStorage.DeleteMember(tx, family.FamilyID, user.UserID); err != nil {
				return err
			}

		case "transfer_owner":
			if err := service.familyStorage.UpdateFamilyOwner(tx, user.UserID, family.FamilyID); err != nil {
				return err
			}
		}
	}
	return nil
}
