package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type SeedYearCreateRequest struct {
	Name      string `json:"name" validate:"required"`
	ShortName string `json:"short_name" validate:"required"`
	Status    string `json:"status" validate:"required"`
}

// ==================== Response ==========================

type SeedYearCreateResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.SeedYearEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SeedYearCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SeedYearCreateRequest{}, helper.ParseOptions{Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	seedYearCreateOutput, err := api.Service.SeedYearCreate(&SeedYearCreateInput{
		SubjectId:             subjectId,
		SeedYearCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SeedYearCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.SeedYearEntity{*seedYearCreateOutput.SeedYearEntity},
		Message:    "Created",
	})
}

// ==================== Service ==========================

type SeedYearCreateInput struct {
	SubjectId string
	*SeedYearCreateRequest
}

type SeedYearCreateOutput struct {
	*constant.SeedYearEntity
}

func (service *serviceStruct) SeedYearCreate(in *SeedYearCreateInput) (*SeedYearCreateOutput, error) {
	seedYear, err := service.schoolAffiliationStorage.SeedYearCreate(nil, &constant.SeedYearEntity{
		Name:      in.Name,
		ShortName: in.ShortName,
		Status:    in.Status,
		CreatedAt: time.Now().UTC(),
		CreatedBy: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	return &SeedYearCreateOutput{seedYear}, nil
}
