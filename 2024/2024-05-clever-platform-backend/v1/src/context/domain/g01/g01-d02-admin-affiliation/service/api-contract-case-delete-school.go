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

type ContractCaseDeleteSchoolRequest struct {
	SchoolIds []int `json:"school_ids" validate:"required"`
}

// ==================== Response ==========================

type ContractCaseDeleteSchoolResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ContractCaseDeleteSchool(context *fiber.Ctx) error {
	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &ContractCaseDeleteSchoolRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	contractCaseDeleteSchoolOutput, err := api.Service.ContractCaseDeleteSchool(&ContractCaseDeleteSchoolInput{
		SubjectId:                       subjectId,
		ContractCaseDeleteSchoolRequest: request,
		ContractId:                      contractId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractCaseDeleteSchoolResponse{
		StatusCode: http.StatusOK,
		Data:       contractCaseDeleteSchoolOutput.SchoolIds,
		Message:    "Deleted",
	})
}

// ==================== Service ==========================

type ContractCaseDeleteSchoolInput struct {
	SubjectId string
	*ContractCaseDeleteSchoolRequest
	ContractId int
}

type ContractCaseDeleteSchoolOutput struct {
	SchoolIds []int
}

func (service *serviceStruct) ContractCaseDeleteSchool(in *ContractCaseDeleteSchoolInput) (*ContractCaseDeleteSchoolOutput, error) {
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

	for _, schoolId := range in.SchoolIds {
		err = service.schoolAffiliationStorage.SchoolCaseRemoveContractSubject(tx, in.ContractId, schoolId)
		if err != nil {
			return nil, err
		}
	}

	_, err = service.schoolAffiliationStorage.ContractUpdate(tx, &contractEntity)
	if err != nil {
		return nil, err
	}

	schoolIds, err := service.schoolAffiliationStorage.ContractCaseDeleteSchool(tx, in.ContractId, in.SchoolIds)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ContractCaseDeleteSchoolOutput{
		SchoolIds: schoolIds,
	}, nil
}
