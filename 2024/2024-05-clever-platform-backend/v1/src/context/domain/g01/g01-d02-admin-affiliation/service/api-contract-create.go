package service

import (
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

type ContractCreateRequest struct {
	SchoolAffiliationId int       `json:"school_affiliation_id" validate:"required"`
	SeedPlatformId      *int      `json:"seed_platform_id"`
	SeedProjectId       *int      `json:"seed_project_id"`
	Name                string    `json:"name" validate:"required"`
	WizardIndex         int       `json:"wizard_index" validate:"required"`
	StartDate           time.Time `json:"start_date" validate:"required"`
	EndDate             time.Time `json:"end_date" validate:"required"`
}

// ==================== Response ==========================

type ContractCreateResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant2.ContractEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

// @Id ContractCreate
// @Tags School Affiliations
// @Summary Create Contract
// @Description เพิ่มสัญญา
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body ContractCreateRequest true "request"
// @Success 201 {object} ContractCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/contract [post]
func (api *APiStruct) ContractCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ContractCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if request.StartDate.After(request.EndDate) {
		msg := "Start date cannot be after end date"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	contractCreateOutput, err := api.Service.ContractCreate(&ContractCreateInput{
		SubjectId:             subjectId,
		ContractCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(ContractCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant2.ContractEntity{*contractCreateOutput.ContractEntity},
		Message:    "School affiliation contract created",
	})
}

// ==================== Service ==========================

type ContractCreateInput struct {
	SubjectId string
	*ContractCreateRequest
}

type ContractCreateOutput struct {
	*constant2.ContractEntity
}

func (service *serviceStruct) ContractCreate(in *ContractCreateInput) (*ContractCreateOutput, error) {
	contractEntity := constant2.ContractEntity{}
	err := copier.Copy(&contractEntity, in.ContractCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	contractEntity.CreatedAt = time.Now().UTC()
	contractEntity.CreatedBy = in.SubjectId
	contractEntity.UpdatedAt = &contractEntity.CreatedAt
	contractEntity.UpdatedBy = &contractEntity.CreatedBy
	contractEntity.Status = string(constant2.Draft)

	contract, err := service.schoolAffiliationStorage.ContractCreate(&contractEntity)
	if err != nil {
		return nil, err
	}

	return &ContractCreateOutput{
		ContractEntity: contract,
	}, nil
}
