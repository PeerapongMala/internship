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

type ContractCaseDeleteSubjectGroupRequest struct {
	SubjectGroupIds []int `json:"subject_group_ids" validate:"required"`
}

// ==================== Response ==========================

type ContractCaseDeleteSubjectGroupResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ContractCaseDeleteSubjectGroup(context *fiber.Ctx) error {
	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &ContractCaseDeleteSubjectGroupRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	contractCaseDeleteSubjectGroupOutput, err := api.Service.ContractCaseDeleteSubjectGroup(&ContractCaseDeleteSubjectGroupInput{
		SubjectId:                             subjectId,
		ContractCaseDeleteSubjectGroupRequest: request,
		ContractId:                            contractId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractCaseDeleteSchoolResponse{
		StatusCode: http.StatusOK,
		Data:       contractCaseDeleteSubjectGroupOutput.SubjectGroupIds,
		Message:    "Deleted",
	})
}

// ==================== Service ==========================

type ContractCaseDeleteSubjectGroupInput struct {
	SubjectId string
	*ContractCaseDeleteSubjectGroupRequest
	ContractId int
}

type ContractCaseDeleteSubjectGroupOutput struct {
	SubjectGroupIds []int
}

func (service *serviceStruct) ContractCaseDeleteSubjectGroup(in *ContractCaseDeleteSubjectGroupInput) (*ContractCaseDeleteSubjectGroupOutput, error) {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	contractEntity := constant.ContractEntity{}
	contractEntity.Id = in.ContractId
	now := time.Now().UTC()
	contractEntity.UpdatedAt = &now
	contractEntity.UpdatedBy = &in.SubjectId

	_, err = service.schoolAffiliationStorage.ContractUpdate(tx, &contractEntity)
	if err != nil {
		return nil, err
	}

	subjectGroupIds, err := service.schoolAffiliationStorage.ContractCaseDeleteSubjectGroup(tx, in.ContractId, in.SubjectGroupIds)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ContractCaseDeleteSubjectGroupOutput{
		SubjectGroupIds: subjectGroupIds,
	}, nil
}
