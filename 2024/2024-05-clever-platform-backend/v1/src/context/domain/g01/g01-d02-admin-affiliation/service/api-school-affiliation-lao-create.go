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

type SchoolAffiliationLaoCreateRequest struct {
	Name        string  `json:"name" validate:"required"`
	ShortName   *string `json:"short_name" validate:"required"`
	Status      string  `json:"status" validate:"required"`
	LaoType     string  `json:"lao_type" validate:"required"`
	Province    *string `json:"province"`
	District    *string `json:"district"`
	SubDistrict *string `json:"sub_district"`
}

// ==================== Response ==========================

type SchoolAffiliationLaoCreateResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []SchoolAffiliationLaoData `json:"data"`
	Message    string                     `json:"message"`
}

type SchoolAffiliationLaoData struct {
	*constant2.SchoolAffiliationEntity
	*constant2.SchoolAffiliationLaoEntity
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationLaoCreate
// @Tags School Affiliations
// @Summary Create school affiliation lao
// @Description เพิ่มสังกัดโรงเรียนประเภท อปท
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body SchoolAffiliationLaoCreateRequest true "request"
// @Success 201 {object} SchoolAffiliationLaoCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/lao [post]
func (api *APiStruct) SchoolAffiliationLaoCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationLaoCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationLaoOutput, err := api.Service.SchoolAffiliationLaoCreate(&SchoolAffiliationLaoCreateInput{
		SubjectId:                         subjectId,
		SchoolAffiliationLaoCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SchoolAffiliationLaoCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []SchoolAffiliationLaoData{{
			SchoolAffiliationEntity:    schoolAffiliationLaoOutput.SchoolAffiliationEntity,
			SchoolAffiliationLaoEntity: schoolAffiliationLaoOutput.SchoolAffiliationLaoEntity,
		}},
		Message: "School Affiliation created",
	})
}

// ==================== Service ==========================

type SchoolAffiliationLaoCreateInput struct {
	SubjectId string
	*SchoolAffiliationLaoCreateRequest
}

type SchoolAffiliationLaoCreateOutput struct {
	*constant2.SchoolAffiliationEntity
	*constant2.SchoolAffiliationLaoEntity
}

func (service *serviceStruct) SchoolAffiliationLaoCreate(in *SchoolAffiliationLaoCreateInput) (*SchoolAffiliationLaoCreateOutput, error) {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	schoolAffiliationEntity := constant2.SchoolAffiliationEntity{}
	err = copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationLaoCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationEntity.SchoolAffiliationGroup = string(constant2.Lao)
	schoolAffiliationEntity.CreatedAt = time.Now().UTC()
	schoolAffiliationEntity.CreatedBy = in.SubjectId
	schoolAffiliation, err := service.schoolAffiliationStorage.SchoolAffiliationCreate(tx, &schoolAffiliationEntity)
	if err != nil {
		return nil, err
	}

	schoolAffiliationLaoEntity := constant2.SchoolAffiliationLaoEntity{}
	err = copier.Copy(&schoolAffiliationLaoEntity, in.SchoolAffiliationLaoCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationLaoEntity.SchoolAffiliationId = schoolAffiliation.Id
	schoolAffiliationLao, err := service.schoolAffiliationStorage.SchoolAffiliationLaoCreate(tx, &schoolAffiliationLaoEntity)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SchoolAffiliationLaoCreateOutput{
		SchoolAffiliationEntity:    schoolAffiliation,
		SchoolAffiliationLaoEntity: schoolAffiliationLao,
	}, nil
}
