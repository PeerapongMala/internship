package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type SeedYearUpdateRequest struct {
	SeedYearId int    `params:"seedYearId" validate:"required"`
	Name       string `json:"name"`
	ShortName  string `json:"short_name"`
	Status     string `json:"status"`
}

// ==================== Response ==========================

type SeedYearUpdateResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.SeedYearEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SeedYearUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SeedYearUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	seedYearUpdateOutput, err := api.Service.SeedYearUpdate(&SeedYearUpdateInput{
		SubjectId:             subjectId,
		SeedYearUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedYearUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SeedYearEntity{*seedYearUpdateOutput.SeedYearEntity},
		Message:    "Updated",
	})
}

// ==================== Service ==========================

type SeedYearUpdateInput struct {
	SubjectId string
	*SeedYearUpdateRequest
}

type SeedYearUpdateOutput struct {
	*constant.SeedYearEntity
}

func (service *serviceStruct) SeedYearUpdate(in *SeedYearUpdateInput) (*SeedYearUpdateOutput, error) {
	now := time.Now().UTC()
	seedYear, err := service.schoolAffiliationStorage.SeedYearUpdate(nil, &constant.SeedYearEntity{
		Id:        in.SeedYearId,
		Name:      in.Name,
		ShortName: in.ShortName,
		Status:    in.Status,
		UpdatedAt: &now,
		UpdatedBy: &in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	return &SeedYearUpdateOutput{seedYear}, nil
}
