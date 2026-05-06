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

type SchoolAffiliationDoeUpdateRequest struct {
	Name         string  `json:"name"`
	ShortName    *string `json:"short_name"`
	Type         string  `json:"type"`
	Status       string  `json:"status"`
	DistrictZone string  `json:"district_zone"`
	District     string  `json:"district"`
}

// ==================== Response ==========================

type SchoolAffiliationDoeUpdateResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []SchoolAffiliationDoeData `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationDoeUpdate
// @Tags School Affiliations
// @Summary Update school affiliation doe
// @Description อัพเดทสังกัดโรงเรียนประเภท สนศ. กทม.
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param schoolAffiliationId path int true "schoolAffiliationId"
// @Param request body SchoolAffiliationDoeUpdateRequest true "request"
// @Success 200 {object} ContractUpdateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/doe/{schoolAffiliationId} [patch]
func (api *APiStruct) SchoolAffiliationDoeUpdate(context *fiber.Ctx) error {
	schoolAffiliationId, err := context.ParamsInt("schoolAffiliationId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationDoeUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationDoeUpdateOutput, err := api.Service.SchoolAffiliationDoeUpdate(&SchoolAffiliationDoeUpdateInput{
		SubjectId:                         subjectId,
		SchoolAffiliationDoeUpdateRequest: request,
		SchoolAffiliationId:               schoolAffiliationId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationDoeUpdateResponse{
		StatusCode: http.StatusOK,
		Data: []SchoolAffiliationDoeData{{
			SchoolAffiliationEntity:    schoolAffiliationDoeUpdateOutput.SchoolAffiliationEntity,
			SchoolAffiliationDoeEntity: schoolAffiliationDoeUpdateOutput.SchoolAffiliationDoeEntity,
		}},
		Message: "School affiliation updated",
	})
}

// ==================== Service ==========================

type SchoolAffiliationDoeUpdateInput struct {
	SubjectId string
	*SchoolAffiliationDoeUpdateRequest
	SchoolAffiliationId int
}

type SchoolAffiliationDoeUpdateOutput struct {
	*constant.SchoolAffiliationEntity
	*constant.SchoolAffiliationDoeEntity
}

func (service *serviceStruct) SchoolAffiliationDoeUpdate(in *SchoolAffiliationDoeUpdateInput) (*SchoolAffiliationDoeUpdateOutput, error) {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	schoolAffiliationEntity := constant.SchoolAffiliationEntity{}
	err = copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationDoeUpdateRequest)
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

	schoolAffiliationDoeEntity := constant.SchoolAffiliationDoeEntity{}
	err = copier.Copy(&schoolAffiliationDoeEntity, in.SchoolAffiliationDoeUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationDoeEntity.SchoolAffiliationId = in.SchoolAffiliationId

	schoolAffiliationDoe, err := service.schoolAffiliationStorage.SchoolAffiliationDoeUpdate(tx, &schoolAffiliationDoeEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SchoolAffiliationDoeUpdateOutput{
		schoolAffiliation,
		schoolAffiliationDoe,
	}, nil
}
