package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type ObserverAccessUpdateRequest struct {
	Id                  *int    `params:"observerAccessId" validate:"required"`
	Name                *string `json:"name" validate:"required"`
	AccessName          *string `json:"access_name" validate:"required"`
	DistrictZone        *string `json:"district_zone"`
	AreaOffice          *string `json:"area_office"`
	DistrictGroup       *string `json:"district_group"`
	District            *string `json:"district"`
	SchoolAffiliationId *int    `json:"school_affiliation_id"`
	Status              *string `json:"status" validate:"required"`
}

// ==================== Response ==========================

type ObserverAccessUpdateResponse struct {
	StatusCode int                             `json:"status_code"`
	Data       []constant.ObserverAccessEntity `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverAccessUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverAccessUpdateRequest{}, helper.ParseOptions{Body: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	observerAccessUpdateOutput, err := api.Service.ObserverAccessUpdate(&ObserverAccessUpdateInput{
		SubjectId:                   &subjectId,
		ObserverAccessUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverAccessUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.ObserverAccessEntity{*observerAccessUpdateOutput.ObserverAccessEntity},
		Message:    "Updated",
	})
}

// ==================== Service ==========================

type ObserverAccessUpdateInput struct {
	SubjectId *string
	*ObserverAccessUpdateRequest
}

type ObserverAccessUpdateOutput struct {
	*constant.ObserverAccessEntity
}

func (service *serviceStruct) ObserverAccessUpdate(in *ObserverAccessUpdateInput) (*ObserverAccessUpdateOutput, error) {
	tx, err := service.adminReportPermissionStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// TODO access_name constant
	if in.AccessName != nil && *in.AccessName != "ผู้บริหารโรงเรียน" {
		err = service.adminReportPermissionStorage.ObserverAccessCaseDeleteAllSchool(tx, *in.Id)
		if err != nil {
			return nil, err
		}
	}

	now := time.Now().UTC()
	observerAccess, err := service.adminReportPermissionStorage.ObserverAccessUpdate(tx, &constant.ObserverAccessEntity{
		Id:                  in.Id,
		Name:                in.Name,
		AccessName:          in.AccessName,
		DistrictZone:        in.DistrictZone,
		AreaOffice:          in.AreaOffice,
		DistrictGroup:       in.DistrictGroup,
		District:            in.District,
		SchoolAffiliationId: in.SchoolAffiliationId,
		Status:              in.Status,
		UpdatedAt:           &now,
		UpdatedBy:           in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ObserverAccessUpdateOutput{
		observerAccess,
	}, nil
}
