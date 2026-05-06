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

type ContractCaseAddSchoolRequest struct {
	SchoolIds []int `json:"school_ids" validate:"required"`
}

// ==================== Response ==========================

type ContractCaseAddSchoolResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ContractCaseAddSchool(context *fiber.Ctx) error {
	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &ContractCaseAddSchoolRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	contractCaseUpdateSchoolOutput, err := api.Service.ContractCaseAddSchool(&ContractCaseAddSchoolInput{
		SubjectId:                    subjectId,
		ContractCaseAddSchoolRequest: request,
		ContractId:                   contractId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractCaseAddSchoolResponse{
		StatusCode: http.StatusOK,
		Data:       contractCaseUpdateSchoolOutput.SchoolIds,
		Message:    "Contract's school added",
	})
}

// ==================== Service ==========================

type ContractCaseAddSchoolInput struct {
	SubjectId string
	*ContractCaseAddSchoolRequest
	ContractId int
}

type ContractCaseAddSchoolOutput struct {
	SchoolIds []int
}

func (service *serviceStruct) ContractCaseAddSchool(in *ContractCaseAddSchoolInput) (*ContractCaseAddSchoolOutput, error) {
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

	schoolIds, err := service.schoolAffiliationStorage.ContractCaseAddSchool(tx, in.ContractId, in.SchoolIds)
	if err != nil {
		return nil, err
	}

	contract, err := service.schoolAffiliationStorage.ContractGet(in.ContractId)
	if err != nil {
		return nil, err
	}

	if contract.Status == string(constant.Draft) {
		err = tx.Commit()
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		return &ContractCaseAddSchoolOutput{
			SchoolIds: schoolIds,
		}, nil

	}

	err = service.PrefillSchool(&PrefillSchoolInput{
		Tx:         tx,
		SchoolIds:  schoolIds,
		ContractId: in.ContractId,
	})
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ContractCaseAddSchoolOutput{
		SchoolIds: schoolIds,
	}, nil
}
