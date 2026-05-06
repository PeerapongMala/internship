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
type SchoolAffiliationObecUpdateRequest struct {
	Name           string  `json:"name"`
	ShortName      *string `json:"short_name"`
	Type           string  `json:"type"`
	Status         string  `json:"status"`
	InspectionArea string  `json:"inspection_area"`
	AreaOffice     string  `json:"area_office"`
}

// ==================== Response ==========================

type SchoolAffiliationObecUpdateResponse struct {
	StatusCode int                         `json:"status_code"`
	Data       []SchoolAffiliationObecData `json:"data"`
	Message    string                      `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationObecUpdate
// @Tags School Affiliations
// @Summary Update school affiliation obec
// @Description อัพเดทสังกัดโรงเรียนประเภท สพฐ
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param schoolAffiliationId path int true "schoolAffiliationId"
// @Param request body SchoolAffiliationObecUpdateRequest true "request"
// @Success 200 {object} SchoolAffiliationObecUpdateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/obec/{schoolAffiliationId} [patch]
func (api *APiStruct) SchoolAffiliationObecUpdate(context *fiber.Ctx) error {
	schoolAffiliationId, err := context.ParamsInt("schoolAffiliationId")
	if err != nil {
		helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationObecUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationObecUpdateOutput, err := api.Service.SchoolAffiliationObecUpdate(&SchoolAffiliationObecUpdateInput{
		SubjectId:                          subjectId,
		SchoolAffiliationObecUpdateRequest: request,
		SchoolAffiliationId:                schoolAffiliationId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationObecUpdateResponse{
		StatusCode: http.StatusOK,
		Data: []SchoolAffiliationObecData{{
			SchoolAffiliationEntity:     schoolAffiliationObecUpdateOutput.SchoolAffiliationEntity,
			SchoolAffiliationObecEntity: schoolAffiliationObecUpdateOutput.SchoolAffiliationObecEntity,
		}},
		Message: "School affiliation updated",
	})
}

// ==================== Service ==========================

type SchoolAffiliationObecUpdateInput struct {
	SubjectId string
	*SchoolAffiliationObecUpdateRequest
	SchoolAffiliationId int
}

type SchoolAffiliationObecUpdateOutput struct {
	*constant.SchoolAffiliationEntity
	*constant.SchoolAffiliationObecEntity
}

func (service *serviceStruct) SchoolAffiliationObecUpdate(in *SchoolAffiliationObecUpdateInput) (*SchoolAffiliationObecUpdateOutput, error) {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	schoolAffiliationEntity := constant.SchoolAffiliationEntity{}
	err = copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationObecUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationEntity.Id = in.SchoolAffiliationId
	now := time.Now().UTC()
	schoolAffiliationEntity.UpdatedAt = &now
	schoolAffiliationEntity.UpdatedBy = &in.SubjectId

	schoolAffiliation, err := service.schoolAffiliationStorage.SchoolAffiliationUpdate(tx, &schoolAffiliationEntity)
	if err != nil {
		return nil, err
	}

	schoolAffiliationObecEntity := constant.SchoolAffiliationObecEntity{}
	err = copier.Copy(&schoolAffiliationObecEntity, in.SchoolAffiliationObecUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationObecEntity.SchoolAffiliationId = in.SchoolAffiliationId

	schoolAffiliationObec, err := service.schoolAffiliationStorage.SchoolAffiliationObecUpdate(tx, &schoolAffiliationObecEntity)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SchoolAffiliationObecUpdateOutput{
		schoolAffiliation,
		schoolAffiliationObec,
	}, nil
}
