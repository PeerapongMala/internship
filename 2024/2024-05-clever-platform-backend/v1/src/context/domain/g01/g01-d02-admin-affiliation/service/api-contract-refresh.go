package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type ContractRefreshRequest struct {
	ContractId int `params:"contractId" validate:"required"`
}

// ==================== Response ==========================

type ContractRefreshResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ContractRefresh(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ContractRefreshRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.ContractRefresh(&ContractRefreshInput{
		ContractRefreshRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractRefreshResponse{
		StatusCode: http.StatusOK,
		Message:    "Refreshed",
	})
}

// ==================== Service ==========================

type ContractRefreshInput struct {
	*ContractRefreshRequest
}

func (service *serviceStruct) ContractRefresh(in *ContractRefreshInput) error {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	defer tx.Rollback()
	schoolIds, err := service.schoolAffiliationStorage.ContractCaseListSchoolId(in.ContractId)
	if err != nil {
		return err
	}

	err = service.PrefillSchool(&PrefillSchoolInput{
		Tx:         tx,
		SchoolIds:  schoolIds,
		ContractId: in.ContractId,
	})
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
