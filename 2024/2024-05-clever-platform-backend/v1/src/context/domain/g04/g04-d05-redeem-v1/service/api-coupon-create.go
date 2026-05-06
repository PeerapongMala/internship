package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type CouponCreateRequest struct {
	*constant.CouponEntity
	SubjectId string
}

// ==================== Response ==========================
type CouponCreateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) CouponCreate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &CouponCreateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.CouponCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CouponCreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) CouponCreate(in *CouponCreateRequest) error {

	sqlTx, err := service.redeemStorage.BeginTx()
	if err != nil {
		return err
	}

	now := time.Now().UTC()
	in.CreatedAt = &now
	in.UpdatedAt = &now
	in.CreatedBy = &in.SubjectId
	in.UpdatedBy = &in.SubjectId

	_, err = service.redeemStorage.InsertCoupon(sqlTx, in.CouponEntity)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
