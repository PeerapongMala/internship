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

type SchoolAffiliationLaoUpdateRequest struct {
	Name        string  `json:"name"`
	ShortName   *string `json:"short_name"`
	Type        string  `json:"type"`
	Status      string  `json:"status"`
	LaoType     string  `json:"lao_type"`
	District    string  `json:"district"`
	SubDistrict string  `json:"sub_district"`
	Province    string  `json:"province"`
}

// ==================== Response ==========================

type SchoolAffiliationLaoUpdateResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []SchoolAffiliationLaoData `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationLaoUpdate
// @Tags School Affiliations
// @Summary Update school affiliation lao
// @Description อัพเดทสังกัดโรงเรียนประเภท อปท
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param schoolAffiliationId path int true "schoolAffiliationId"
// @Param request body SchoolAffiliationLaoUpdateRequest true "request"
// @Success 200 {object} SchoolAffiliationLaoUpdateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/lao/{schoolAffiliationId} [patch]
func (api *APiStruct) SchoolAffiliationLaoUpdate(context *fiber.Ctx) error {
	schoolAffiliationId, err := context.ParamsInt("schoolAffiliationId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationLaoUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationLaoUpdateOutput, err := api.Service.SchoolAffiliationLaoUpdate(&SchoolAffiliationLaoUpdateInput{
		SubjectId:                         subjectId,
		SchoolAffiliationLaoUpdateRequest: request,
		SchoolAffiliationId:               schoolAffiliationId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationLaoUpdateResponse{
		StatusCode: http.StatusOK,
		Data: []SchoolAffiliationLaoData{{
			SchoolAffiliationEntity:    schoolAffiliationLaoUpdateOutput.SchoolAffiliationEntity,
			SchoolAffiliationLaoEntity: schoolAffiliationLaoUpdateOutput.SchoolAffiliationLaoEntity,
		}},
		Message: "School affiliation updated",
	})
}

// ==================== Service ==========================

type SchoolAffiliationLaoUpdateInput struct {
	SubjectId string
	*SchoolAffiliationLaoUpdateRequest
	SchoolAffiliationId int
}

type SchoolAffiliationLaoUpdateOutput struct {
	*constant.SchoolAffiliationEntity
	*constant.SchoolAffiliationLaoEntity
}

func (service *serviceStruct) SchoolAffiliationLaoUpdate(in *SchoolAffiliationLaoUpdateInput) (*SchoolAffiliationLaoUpdateOutput, error) {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	schoolAffiliationEntity := constant.SchoolAffiliationEntity{}
	err = copier.Copy(&schoolAffiliationEntity, in.SchoolAffiliationLaoUpdateRequest)
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

	schoolAffiliationLaoEntity := constant.SchoolAffiliationLaoEntity{}
	err = copier.Copy(&schoolAffiliationLaoEntity, in.SchoolAffiliationLaoUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	schoolAffiliationLaoEntity.SchoolAffiliationId = in.SchoolAffiliationId

	schoolAffiliationLao, err := service.schoolAffiliationStorage.SchoolAffiliationLaoUpdate(tx, &schoolAffiliationLaoEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SchoolAffiliationLaoUpdateOutput{
		SchoolAffiliationEntity:    schoolAffiliation,
		SchoolAffiliationLaoEntity: schoolAffiliationLao,
	}, nil
}
