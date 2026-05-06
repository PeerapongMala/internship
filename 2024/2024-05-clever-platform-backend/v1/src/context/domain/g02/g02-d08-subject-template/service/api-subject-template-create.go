package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type SubjectTemplateCreateRequest struct {
	Name        string `json:"name" validate:"required"`
	Status      string `json:"status" validate:"required"`
	SeedYearId  int    `json:"seed_year_id" validate:"required"`
	SubjectId   int    `json:"subject_id" validate:"required"`
	WizardIndex int    `json:"wizard_index" validate:"required"`
}

// ==================== Response ==========================

type SubjectTemplateCreateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []constant.Id `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectTemplateCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectTemplateCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectTemplateCreateOutput, err := api.Service.SubjectTemplateCreate(&SubjectTemplateCreateInput{
		UserId:                       subjectId,
		SubjectTemplateCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SubjectTemplateCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.Id{subjectTemplateCreateOutput.Id},
		Message:    "Created",
	})
}

// ==================== Service ==========================

type SubjectTemplateCreateInput struct {
	UserId string
	*SubjectTemplateCreateRequest
}

type SubjectTemplateCreateOutput struct {
	Id constant.Id
}

func (service *serviceStruct) SubjectTemplateCreate(in *SubjectTemplateCreateInput) (*SubjectTemplateCreateOutput, error) {
	id, err := service.subjectTemplateStorage.SubjectTemplateCreate(&constant.SubjectTemplateEntity{
		Name:        &in.Name,
		SubjectId:   &in.SubjectId,
		SeedYearId:  &in.SeedYearId,
		Status:      &in.Status,
		CreatedAt:   helper.ToPtr(time.Now().UTC()),
		CreatedBy:   &in.UserId,
		WizardIndex: &in.WizardIndex,
	})
	if err != nil {
		return nil, err
	}
	return &SubjectTemplateCreateOutput{Id: *id}, nil
}
