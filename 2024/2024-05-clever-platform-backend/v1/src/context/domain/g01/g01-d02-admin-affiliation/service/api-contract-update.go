package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type ContractUpdateRequest struct {
	SeedPlatformId *int      `json:"seed_platform_id"`
	SeedProjectId  *int      `json:"seed_project_id"`
	Name           string    `json:"name"`
	StartDate      time.Time `json:"start_date"`
	EndDate        time.Time `json:"end_date"`
	Status         string    `json:"status"`
	WizardIndex    int       `json:"wizard_index"`
}

// ==================== Response ==========================

type ContractUpdateResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant2.ContractEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ContractUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ContractUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	contractUpdateOutput, err := api.Service.ContractUpdate(&ContractUpdateInput{
		SubjectId:             subjectId,
		ContractUpdateRequest: request,
		ContractId:            contractId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant2.ContractEntity{*contractUpdateOutput.ContractEntity},
		Message:    "Contract updated",
	})
}

// ==================== Service ==========================

type ContractUpdateInput struct {
	SubjectId string
	*ContractUpdateRequest
	ContractId int
}

type ContractUpdateOutput struct {
	*constant2.ContractEntity
}

func (service *serviceStruct) ContractUpdate(in *ContractUpdateInput) (*ContractUpdateOutput, error) {
	contract, err := service.schoolAffiliationStorage.ContractGet(in.ContractId)
	if err != nil {
		return nil, err
	}
	if !in.StartDate.IsZero() && in.StartDate.After(contract.EndDate) {
		msg := "New start date can't be after contract's end date"
		return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
	}
	if !in.EndDate.IsZero() && in.EndDate.Before(contract.StartDate) {
		msg := "New end date can't be before contract's start date"
		return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
	}
	if !in.EndDate.IsZero() && !in.StartDate.IsZero() && in.StartDate.After(contract.EndDate) {
		msg := "End date can't be before start date"
		return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
	}
	if contract.Status != string(constant2.Draft) && (!in.EndDate.IsZero() || !in.StartDate.IsZero()) {
		msg := "Start and end date of a contract can't be edited after the contract is published"
		return nil, helper.NewHttpError(http.StatusConflict, &msg)
	}
	if !constant2.ValidateContractStatus(constant2.ContractStatus(contract.Status), constant2.ContractStatus(in.Status)) {
		msg := fmt.Sprintf(`Can't change contract's status from %s to %s`, contract.Status, in.Status)
		return nil, helper.NewHttpError(http.StatusConflict, &msg)
	}

	contract, err = service.schoolAffiliationStorage.ContractGet(in.ContractId)
	if err != nil {
		return nil, err
	}

	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer tx.Rollback()

	if constant2.ContractStatus(in.Status) == constant2.Enabled && contract.Status != string(constant2.Enabled) {
		schoolIds, err := service.schoolAffiliationStorage.ContractCaseListSchoolId(in.ContractId)
		if err != nil {
			return nil, err
		}

		err = service.PrefillSchool(&PrefillSchoolInput{
			Tx:         tx,
			SchoolIds:  schoolIds,
			ContractId: in.ContractId,
		})
		if err != nil {
			return nil, err
		}
	}

	contractEntity := constant2.ContractEntity{}
	err = copier.Copy(&contractEntity, in.ContractUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	contractEntity.Id = in.ContractId
	now := time.Now().UTC()
	contractEntity.UpdatedAt = &now
	contractEntity.UpdatedBy = &in.SubjectId

	contract, err = service.schoolAffiliationStorage.ContractUpdate(tx, &contractEntity)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ContractUpdateOutput{
		contract,
	}, nil
}
