package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type CouponUseRequest struct {
	ItemId int `json:"item_id" validate:"required"`
}

// ==================== Response ==========================

type CouponUseResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) CouponUse(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &CouponUseRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.CouponUse(&CouponUseInput{
		CouponUseRequest: request,
		SubjectId:        subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CouponUseResponse{
		StatusCode: http.StatusOK,
		Message:    "used",
	})
}

// ==================== Service ==========================

type CouponUseInput struct {
	*CouponUseRequest
	SubjectId string
}

func (service *serviceStruct) CouponUse(in *CouponUseInput) error {
	tx, err := service.customAvatarStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	count, err := service.customAvatarStorage.CouponUse(tx, in.ItemId, in.SubjectId)
	if err != nil {
		return err
	}

	if *count == 0 {
		msg := "not enough coupon"
		return helper.NewHttpError(http.StatusConflict, &msg)
	}

	err = service.customAvatarStorage.UpdateTeacherRewardTransaction(tx, in.ItemId, in.SubjectId)
	if err != nil {
		return err
	}

	err = service.customAvatarStorage.CouponTransactionCreate(tx, in.ItemId, in.SubjectId)
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
