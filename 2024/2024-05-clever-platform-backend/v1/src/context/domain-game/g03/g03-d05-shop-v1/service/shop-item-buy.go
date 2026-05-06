package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type ShopItemBuyRequest struct {
	ShopItemId int `json:"shop_item_id" validate:"required"`
}

// ==================== Response ==========================

type ShopItemBuyResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ShopItemBuy(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ShopItemBuyRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	err = api.Service.ShopItemBuy(&ShopItemBuyInput{
		ShopItemBuyRequest: request,
		SubjectId:          subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ShopItemBuyResponse{
		StatusCode: http.StatusOK,
		Message:    "Bought",
	})
}

// ==================== Service ==========================

type ShopItemBuyInput struct {
	*ShopItemBuyRequest
	SubjectId string
}

func (service *serviceStruct) ShopItemBuy(in *ShopItemBuyInput) error {
	tx, err := service.shopStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	coins, err := service.shopStorage.InventoryCoinGet(tx, in.SubjectId)
	if err != nil {
		return err
	}

	price, err := service.shopStorage.ShopItemGetPrice(tx, in.ShopItemId)
	if err != nil {
		return err
	}

	if *coins < *price {
		msg := "Insufficient coins"
		return helper.NewHttpError(fiber.StatusConflict, &msg)
	}

	valid, err := service.shopStorage.ShopItemCheckStock(in.ShopItemId)
	if err != nil {
		return err
	}

	if !*valid {
		msg := "Out of stock or not in selling period"
		return helper.NewHttpError(fiber.StatusConflict, &msg)
	}

	limitPerUser, err := service.shopStorage.TeacherShopItemGetLimit(in.ShopItemId)
	if err != nil {
		return err
	}

	if limitPerUser != nil {
		usage, err := service.shopStorage.TeacherShopItemCaseCountUsage(in.SubjectId, in.ShopItemId)
		if err != nil {
			return err
		}
		if usage >= *limitPerUser {
			msg := fmt.Sprintf("Purchase Limit Exceeded: You can only buy %d of this item", *limitPerUser)
			return helper.NewHttpError(fiber.StatusConflict, &msg)
		}
	}

	err = service.shopStorage.InventoryCoinUpdate(tx, in.SubjectId, *coins-*price)
	if err != nil {
		return err
	}

	err = service.shopStorage.ShopTransactionCreate(tx, &constant.TeacherStoreTransactionEntity{
		TeacherStoreItemId: in.ShopItemId,
		StudentId:          in.SubjectId,
		Status:             constant.TransactionBought,
		BoughtAt:           time.Now().UTC(),
	})
	if err != nil {
		return err
	}

	inventoryId, err := service.shopStorage.InventoryGet(in.SubjectId)
	if err != nil {
		return err
	}

	itemId, err := service.shopStorage.ShopGetItemId(in.ShopItemId)
	if err != nil {
		return err
	}

	err = service.shopStorage.InventoryUpdate(*inventoryId, *itemId)
	if err != nil {
		return err
	}

	err = service.shopStorage.ShopItemUpdateStock(in.ShopItemId)
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
