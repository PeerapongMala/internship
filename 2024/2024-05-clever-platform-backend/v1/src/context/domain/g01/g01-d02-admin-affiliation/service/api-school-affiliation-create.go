package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SchoolAffiliationCreateRequest struct {
	SchoolAffiliationGroup string `json:"school_affiliation_group" validate:"required"`
	Type                   string `json:"type"`
	Name                   string `json:"name" validate:"required"`
	ShortName              string `json:"short_name" validate:"required"`
	Status                 string `json:"status" validate:"required"`
}

// ==================== Response ==========================

type SchoolAffiliationCreateResponse struct {
	StatusCode int                                 `json:"status_code"`
	Data       []constant2.SchoolAffiliationEntity `json:"data"`
	Message    string                              `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationCreate
// @Tags School Affiliations
// @Summary Create school affiliation
// @Description เพิ่มสังกัดโรงเรียนประเภท สช / "อื่นๆ"
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body SchoolAffiliationCreateRequest true "request"
// @Success 201 {object} SchoolAffiliationCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/ [post]
func (api *APiStruct) SchoolAffiliationCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if request.SchoolAffiliationGroup != string(constant.Others) && request.SchoolAffiliationGroup != string(constant.Opec) {
		msg := "Invalid school affiliation group"
		err := helper.NewHttpError(http.StatusBadRequest, &msg)
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationCreateOutput, err := api.Service.SchoolAffiliationCreate(&SchoolAffiliationCreateInput{
		SubjectId:                      subjectId,
		SchoolAffiliationCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SchoolAffiliationCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []constant2.SchoolAffiliationEntity{
			*schoolAffiliationCreateOutput.SchoolAffiliationEntity,
		},
		Message: "School affiliation created",
	})
}

// ==================== Service ==========================

type SchoolAffiliationCreateInput struct {
	SubjectId string
	*SchoolAffiliationCreateRequest
}

type SchoolAffiliationCreateOutput struct {
	*constant2.SchoolAffiliationEntity
}

func (service *serviceStruct) SchoolAffiliationCreate(in *SchoolAffiliationCreateInput) (*SchoolAffiliationCreateOutput, error) {
	schoolAffiliationEntity := &constant2.SchoolAffiliationEntity{}
	err := copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationEntity.CreatedAt = time.Now().UTC()
	schoolAffiliationEntity.CreatedBy = in.SubjectId
	schoolAffiliationEntity.UpdatedAt = &schoolAffiliationEntity.CreatedAt
	schoolAffiliationEntity.UpdatedBy = &schoolAffiliationEntity.CreatedBy

	schoolAffiliation, err := service.schoolAffiliationStorage.SchoolAffiliationCreate(nil, schoolAffiliationEntity)
	if err != nil {
		return nil, err
	}

	return &SchoolAffiliationCreateOutput{
		SchoolAffiliationEntity: schoolAffiliation,
	}, nil
}
