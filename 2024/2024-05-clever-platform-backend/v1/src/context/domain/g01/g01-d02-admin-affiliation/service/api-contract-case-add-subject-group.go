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

type ContractCaseUpdateSubjectGroupRequest struct {
	Subjects []constant.ContractSubjectGroupEntity `json:"subjects" validate:"required,dive"`
}

// ==================== Response ==========================

type ContractCaseUpdateSubjectGroupResponse struct {
	StatusCode int                                   `json:"status_code"`
	Data       []constant.ContractSubjectGroupEntity `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

// @Id ContractCaseAddSubjectGroup
// @Tags School Affiliations
// @Summary Update contract's subjects
// @Description อัพเดทหลักสูตรในสัญญา
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param contractId path string true "contractId"
// @Param request body ContractCaseUpdateSubjectRequest true "request"
// @Success 200 {object} ContractCaseUpdateSubjectResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/contract/{contractId}/subjects [patch]
func (api *APiStruct) ContractCaseAddSubjectGroup(context *fiber.Ctx) error {
	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &ContractCaseUpdateSubjectGroupRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	contractUpdateSubjectGroupOutput, err := api.Service.ContractCaseAddSubjectGroup(&ContractCaseAddSubjectGroupInput{
		SubjectId:                             subjectId,
		ContractCaseUpdateSubjectGroupRequest: request,
		ContractId:                            contractId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractCaseUpdateSubjectGroupResponse{
		StatusCode: http.StatusOK,
		Data:       contractUpdateSubjectGroupOutput.SubjectGroups,
		Message:    "Contract's subject group updated",
	})
}

// ==================== Service ==========================

type ContractCaseAddSubjectGroupInput struct {
	SubjectId string
	*ContractCaseUpdateSubjectGroupRequest
	ContractId int
}

type ContractCaseAddSubjectGroupOutput struct {
	SubjectGroups []constant.ContractSubjectGroupEntity
}

func (service *serviceStruct) ContractCaseAddSubjectGroup(in *ContractCaseAddSubjectGroupInput) (*ContractCaseAddSubjectGroupOutput, error) {
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

	subjects, err := service.schoolAffiliationStorage.ContractCaseAddSubjectGroup(tx, in.ContractId, in.Subjects)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ContractCaseAddSubjectGroupOutput{
		SubjectGroups: subjects,
	}, nil
}
