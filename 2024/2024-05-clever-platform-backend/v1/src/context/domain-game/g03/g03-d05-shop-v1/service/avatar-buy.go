package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type AvatarBuyRequest struct {
	AvatarId int `json:"avatar_id" validate:"required"`
}

type AvatarBuyResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AvatarBuy(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AvatarBuyRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	err = api.Service.AvatarBuy(&AvatarBuyInput{
		AvatarBuyRequest: request,
		SubjectId:        subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AvatarBuyResponse{
		StatusCode: http.StatusOK,
		Message:    "Bought",
	})
}

// ==================== Service ==========================

type AvatarBuyInput struct {
	*AvatarBuyRequest
	SubjectId string
}

func (service *serviceStruct) AvatarBuy(in *AvatarBuyInput) error {
	tx, err := service.shopStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	coins, err := service.shopStorage.InventoryCoinGet(tx, in.SubjectId)
	if err != nil {
		return err
	}

	price, err := service.shopStorage.AvatarGetPrice(in.AvatarId)
	if err != nil {
		return err
	}

	if *coins < *price {
		msg := "Insufficient coins"
		return helper.NewHttpError(fiber.StatusConflict, &msg)
	}

	err = service.shopStorage.InventoryCoinUpdate(tx, in.SubjectId, *coins-*price)
	if err != nil {
		return err
	}

	inventoryId, err := service.shopStorage.InventoryGet(in.SubjectId)
	if err != nil {
		return err
	}

	err = service.shopStorage.InventoryAvatarUpdate(tx, *inventoryId, in.AvatarId)
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
