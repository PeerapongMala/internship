package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ContractGetResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.ContractEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ContractGet(context *fiber.Ctx) error {
	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	contractGetOutput, err := api.Service.ContractGet(&ContractGetInput{
		ContractId: contractId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.ContractEntity{contractGetOutput.Contract},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ContractGetInput struct {
	ContractId int
}

type ContractGetOutput struct {
	Contract constant.ContractEntity
}

func (service *serviceStruct) ContractGet(in *ContractGetInput) (*ContractGetOutput, error) {
	contract, err := service.schoolAffiliationStorage.ContractGet(in.ContractId)
	if err != nil {
		return nil, err
	}

	return &ContractGetOutput{
		Contract: *contract,
	}, nil
}
