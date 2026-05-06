package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type ObserverAccessCreateRequest struct {
	Name                *string `json:"name" validate:"required"`
	AccessName          *string `json:"access_name" validate:"required"`
	DistrictZone        *string `json:"district_zone"`
	AreaOffice          *string `json:"area_office"`
	DistrictGroup       *string `json:"district_group"`
	District            *string `json:"district"`
	SchoolAffiliationId *int    `json:"school_affiliation_id"`
	Status              *string `json:"status" validate:"required"`
	//SchoolIds           []int   `json:"schools"`
}

// ==================== Response ==========================

type ObserverAccessCreateResponse struct {
	StatusCode int                             `json:"status_code"`
	Data       []constant.ObserverAccessEntity `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverAccessCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverAccessCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	observerAccessCreateOutput, err := api.Service.ObserverAccessCreate(&ObserverAccessCreateInput{
		SubjectId:                   subjectId,
		ObserverAccessCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverAccessCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.ObserverAccessEntity{*observerAccessCreateOutput.ObserverAccessEntity},
		Message:    "Created",
	})
}

// ==================== Service ==========================

type ObserverAccessCreateInput struct {
	SubjectId string
	*ObserverAccessCreateRequest
}

type ObserverAccessCreateOutput struct {
	*constant.ObserverAccessEntity
}

func (service *serviceStruct) ObserverAccessCreate(in *ObserverAccessCreateInput) (*ObserverAccessCreateOutput, error) {
	now := time.Now().UTC()
	observerAccess, err := service.adminReportPermissionStorage.ObserverAccessCreate(&constant.ObserverAccessEntity{
		Name:                in.Name,
		AccessName:          in.AccessName,
		DistrictZone:        in.DistrictZone,
		AreaOffice:          in.AreaOffice,
		DistrictGroup:       in.DistrictGroup,
		District:            in.District,
		SchoolAffiliationId: in.SchoolAffiliationId,
		Status:              in.Status,
		CreatedAt:           &now,
		CreatedBy:           &in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	return &ObserverAccessCreateOutput{
		observerAccess,
	}, nil
}
