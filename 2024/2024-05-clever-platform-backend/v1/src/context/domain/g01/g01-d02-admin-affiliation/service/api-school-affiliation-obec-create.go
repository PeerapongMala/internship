package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SchoolAffiliationObecCreateRequest struct {
	Type           string  `json:"type" validate:"required"`
	Name           string  `json:"name" validate:"required"`
	ShortName      *string `json:"short_name"`
	Status         string  `json:"status" validate:"required"`
	InspectionArea string  `json:"inspection_area" validate:"required"`
	AreaOffice     string  `json:"area_office" validate:"required"`
}

// ==================== Response ==========================

type SchoolAffiliationObecCreateResponse struct {
	StatusCode int                         `json:"status_code"`
	Data       []SchoolAffiliationObecData `json:"data"`
	Message    string                      `json:"message"`
}

type SchoolAffiliationObecData struct {
	*constant2.SchoolAffiliationEntity
	*constant2.SchoolAffiliationObecEntity
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationObecCreate
// @Tags School Affiliations
// @Summary Create school affiliation obec
// @Description เพิ่มสังกัดโรงเรียนประเภท สพฐ
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body SchoolAffiliationObecCreateRequest true "request"
// @Success 201 {object} SchoolAffiliationObecCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/obec [post]
func (api *APiStruct) SchoolAffiliationObecCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationObecCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationObecCreateOutput, err := api.Service.SchoolAffiliationObecCreate(&SchoolAffiliationObecCreateInput{
		SubjectId:                          subjectId,
		SchoolAffiliationObecCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SchoolAffiliationObecCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []SchoolAffiliationObecData{{
			SchoolAffiliationEntity:     schoolAffiliationObecCreateOutput.SchoolAffiliationEntity,
			SchoolAffiliationObecEntity: schoolAffiliationObecCreateOutput.SchoolAffiliationObecEntity,
		}},
		Message: "School affiliation created",
	})
}

// ==================== Service ==========================

type SchoolAffiliationObecCreateInput struct {
	SubjectId string
	*SchoolAffiliationObecCreateRequest
}

type SchoolAffiliationObecCreateOutput struct {
	*constant2.SchoolAffiliationEntity
	*constant2.SchoolAffiliationObecEntity
}

func (service *serviceStruct) SchoolAffiliationObecCreate(in *SchoolAffiliationObecCreateInput) (*SchoolAffiliationObecCreateOutput, error) {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	schoolAffiliationEntity := constant2.SchoolAffiliationEntity{}
	err = copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationObecCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationEntity.SchoolAffiliationGroup = string(constant2.Obec)
	schoolAffiliationEntity.CreatedAt = time.Now().UTC()
	schoolAffiliationEntity.CreatedBy = in.SubjectId
	schoolAffiliation, err := service.schoolAffiliationStorage.SchoolAffiliationCreate(tx, &schoolAffiliationEntity)
	if err != nil {
		return nil, err
	}

	schoolAffiliationObecEntity := constant2.SchoolAffiliationObecEntity{}
	err = copier.Copy(&schoolAffiliationObecEntity, in.SchoolAffiliationObecCreateRequest)
	err = copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationObecCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationObecEntity.SchoolAffiliationId = schoolAffiliation.Id
	schoolAffiliationObec, err := service.schoolAffiliationStorage.SchoolAffiliationObecCreate(tx, &schoolAffiliationObecEntity)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &SchoolAffiliationObecCreateOutput{
		SchoolAffiliationEntity:     schoolAffiliation,
		SchoolAffiliationObecEntity: schoolAffiliationObec,
	}, nil
}
