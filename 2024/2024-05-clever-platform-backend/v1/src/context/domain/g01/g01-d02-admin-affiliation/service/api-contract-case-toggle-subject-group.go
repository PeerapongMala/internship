package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type ContractCaseToggleSubjectGroupRequest struct {
	IsEnabled *bool `json:"is_enabled" validate:"required"`
}

// ==================== Response ==========================

type ContractCaseToggleSubjectGroupResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ContractCaseToggleSubjectGroup(context *fiber.Ctx) error {
	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectGroupId, err := context.ParamsInt("subjectGroupId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &ContractCaseToggleSubjectGroupRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ContractCaseToggleSubjectGroup(&ContractCaseToggleSubjectGroupInput{
		SubjectId:                             subjectId,
		ContractCaseToggleSubjectGroupRequest: request,
		ContractId:                            contractId,
		SubjectGroupId:                        subjectGroupId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractCaseToggleSubjectGroupResponse{
		StatusCode: http.StatusOK,
		Message:    "Toggled",
	})
}

// ==================== Service ==========================

type ContractCaseToggleSubjectGroupInput struct {
	SubjectId string
	*ContractCaseToggleSubjectGroupRequest
	ContractId     int
	SubjectGroupId int
}

func (service *serviceStruct) ContractCaseToggleSubjectGroup(in *ContractCaseToggleSubjectGroupInput) error {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	contractEntity := constant.ContractEntity{}
	contractEntity.Id = in.ContractId
	now := time.Now().UTC()
	contractEntity.UpdatedAt = &now
	contractEntity.UpdatedBy = &in.SubjectId

	_, err = service.schoolAffiliationStorage.ContractUpdate(tx, &contractEntity)
	if err != nil {
		return err
	}

	err = service.schoolAffiliationStorage.ContractCaseToggleSubjectGroup(tx, in.ContractId, in.SubjectGroupId, *in.IsEnabled)
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
