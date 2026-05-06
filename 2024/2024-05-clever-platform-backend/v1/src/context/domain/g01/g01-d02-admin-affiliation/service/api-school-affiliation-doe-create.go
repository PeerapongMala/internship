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

type SchoolAffiliationDoeCreateRequest struct {
	Type         string  `json:"type" validate:"required"`
	Name         string  `json:"name" validate:"required"`
	ShortName    *string `json:"short_name" validate:"required"`
	Status       string  `json:"status" validate:"required"`
	DistrictZone string  `json:"district_zone" validate:"required"`
	District     string  `json:"district" validate:"required"`
}

// ==================== Response ==========================

type SchoolAffiliationDoeCreateResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []SchoolAffiliationDoeData `json:"data"`
	Message    string                     `json:"message"`
}

type SchoolAffiliationDoeData struct {
	*constant2.SchoolAffiliationEntity
	*constant2.SchoolAffiliationDoeEntity
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationDoeCreate
// @Tags School Affiliations
// @Summary Create school affiliation doe
// @Description เพิ่มสังกัดโรงเรียนประเภท สนศ กทม
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body SchoolAffiliationDoeCreateRequest true "request"
// @Success 201 {object} SchoolAffiliationDoeCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/doe [post]
func (api *APiStruct) SchoolAffiliationDoeCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationDoeCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationDoeCreateOutput, err := api.Service.SchoolAffiliationDoeCreate(&SchoolAffiliationDoeCreateInput{
		SubjectId:                         subjectId,
		SchoolAffiliationDoeCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SchoolAffiliationDoeCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []SchoolAffiliationDoeData{{
			SchoolAffiliationEntity:    schoolAffiliationDoeCreateOutput.SchoolAffiliationEntity,
			SchoolAffiliationDoeEntity: schoolAffiliationDoeCreateOutput.SchoolAffiliationDoeEntity,
		}},
		Message: "School affiliation created",
	})
}

// ==================== Service ==========================

type SchoolAffiliationDoeCreateInput struct {
	SubjectId string
	*SchoolAffiliationDoeCreateRequest
}

type SchoolAffiliationDoeCreateOutput struct {
	*constant2.SchoolAffiliationEntity
	*constant2.SchoolAffiliationDoeEntity
}

func (service *serviceStruct) SchoolAffiliationDoeCreate(in *SchoolAffiliationDoeCreateInput) (*SchoolAffiliationDoeCreateOutput, error) {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	schoolAffiliationEntity := constant2.SchoolAffiliationEntity{}
	err = copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationDoeCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationEntity.SchoolAffiliationGroup = string(constant2.Doe)
	schoolAffiliationEntity.CreatedAt = time.Now().UTC()
	schoolAffiliationEntity.CreatedBy = in.SubjectId
	schoolAffiliation, err := service.schoolAffiliationStorage.SchoolAffiliationCreate(tx, &schoolAffiliationEntity)
	if err != nil {
		return nil, err
	}
	schoolAffiliation.SchoolAffiliationGroup = string(constant2.Doe)

	schoolAffiliationDoeEntity := &constant2.SchoolAffiliationDoeEntity{}
	err = copier.Copy(&schoolAffiliationDoeEntity, in.SchoolAffiliationDoeCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationDoeEntity.SchoolAffiliationId = schoolAffiliation.Id
	schoolAffiliationDoe, err := service.schoolAffiliationStorage.SchoolAffiliationDoeCreate(tx, schoolAffiliationDoeEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SchoolAffiliationDoeCreateOutput{
		SchoolAffiliationEntity:    schoolAffiliation,
		SchoolAffiliationDoeEntity: schoolAffiliationDoe,
	}, nil
}
