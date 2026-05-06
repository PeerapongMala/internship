package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type ObserverCaseUpdateAccessRequest struct {
	ObserverAccesses []int `json:"observer_accesses" validate:"required"`
}

// ==================== Response ==========================

type ObserverCaseUpdateAccessResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverCaseUpdateObserverAccesses(context *fiber.Ctx) error {
	userId := context.Params("userId")

	request, err := helper.ParseAndValidateRequest(context, &ObserverCaseUpdateAccessRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	observerAccesses, err := api.Service.ObserverCaseUpdateObserverAccesses(&ObserverCaseUpdateObserverAccessesInput{
		UserId:                          userId,
		ObserverCaseUpdateAccessRequest: request,
		SubjectId:                       subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverCaseUpdateAccessResponse{
		StatusCode: http.StatusOK,
		Data:       observerAccesses.ObserverAccesses,
		Message:    "Observer updated",
	})
}

// ==================== Service ==========================

type ObserverCaseUpdateObserverAccessesInput struct {
	UserId string
	*ObserverCaseUpdateAccessRequest
	SubjectId string
}

type ObserverCaseUpdateObserverAccessesOutput struct {
	ObserverAccesses []int
}

func (service *serviceStruct) ObserverCaseUpdateObserverAccesses(in *ObserverCaseUpdateObserverAccessesInput) (*ObserverCaseUpdateObserverAccessesOutput, error) {
	now := time.Now().UTC()
	userEntity := constant.UserEntity{
		Id:        in.UserId,
		UpdatedAt: &now,
		UpdatedBy: &in.SubjectId,
	}

	tx, err := service.adminUserAccountStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	_, err = service.adminUserAccountStorage.UserUpdate(tx, &userEntity)
	if err != nil {
		return nil, err
	}

	err = service.adminUserAccountStorage.ObserverCaseUpdateObserverAccesses(tx, in.UserId, in.ObserverAccesses)
	if err != nil {
		return nil, err
	}
	if in.ObserverAccesses == nil {
		in.ObserverAccesses = []int{}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ObserverCaseUpdateObserverAccessesOutput{
		ObserverAccesses: in.ObserverAccesses,
	}, nil
}
