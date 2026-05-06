package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SchoolAffiliationUpdateRequest struct {
	Name      string  `json:"name"`
	ShortName *string `json:"short_name"`
	Type      string  `json:"type"`
	Status    string  `json:"status"`
}

// ==================== Response ==========================

type SchoolAffiliationUpdateResponse struct {
	StatusCode int                                `json:"status_code"`
	Data       []constant.SchoolAffiliationEntity `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SchoolAffiliationUpdate(context *fiber.Ctx) error {
	schoolAffiliationId, err := context.ParamsInt("schoolAffiliationId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationUpdateOutput, err := api.Service.SchoolAffiliationUpdate(&SchoolAffiliationUpdateInput{
		SubjectId:                      subjectId,
		SchoolAffiliationUpdateRequest: request,
		SchoolAffiliationId:            schoolAffiliationId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationUpdateResponse{
		StatusCode: http.StatusOK,
		Data: []constant.SchoolAffiliationEntity{
			*schoolAffiliationUpdateOutput.SchoolAffiliationEntity,
		},
		Message: "School Affiliation updated",
	})
}

// ==================== Service ==========================

type SchoolAffiliationUpdateInput struct {
	SubjectId string
	*SchoolAffiliationUpdateRequest
	SchoolAffiliationId int
}

type SchoolAffiliationUpdateOutput struct {
	*constant.SchoolAffiliationEntity
}

func (service *serviceStruct) SchoolAffiliationUpdate(in *SchoolAffiliationUpdateInput) (*SchoolAffiliationCreateOutput, error) {
	schoolAffiliationEntity := constant.SchoolAffiliationEntity{}
	err := copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	now := time.Now().UTC()
	schoolAffiliationEntity.Id = in.SchoolAffiliationId
	schoolAffiliationEntity.UpdatedAt = &now
	schoolAffiliationEntity.UpdatedBy = &in.SubjectId

	schoolAffiliation, err := service.schoolAffiliationStorage.SchoolAffiliationUpdate(nil, &schoolAffiliationEntity)
	if err != nil {
		return nil, err
	}

	return &SchoolAffiliationCreateOutput{
		SchoolAffiliationEntity: schoolAffiliation,
	}, nil
}
