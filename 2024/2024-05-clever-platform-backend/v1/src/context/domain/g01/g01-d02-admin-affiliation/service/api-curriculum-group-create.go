package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type CurriculumGroupCreateRequest struct {
	Name      string `json:"name" validate:"required"`
	ShortName string `json:"short_name" validate:"required"`
	Status    string `json:"status" validate:"required"`
}

type CurriculumGroupCreateResponse struct {
	StatusCode int                              `json:"status_code"`
	Data       []constant.CurriculumGroupEntity `json:"data""`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &CurriculumGroupCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	curriculumGroupCreateOutput, err := api.Service.CurriculumGroupCreate(&CurriculumGroupCreateInput{
		SubjectId:                    subjectId,
		CurriculumGroupCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(CurriculumGroupCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.CurriculumGroupEntity{*curriculumGroupCreateOutput.CurriculumGroupEntity},
		Message:    "Curriculum group created",
	})
}

// ==================== Service ==========================

type CurriculumGroupCreateInput struct {
	SubjectId string
	*CurriculumGroupCreateRequest
}

type CurriculumGroupCreateOutput struct {
	*constant.CurriculumGroupEntity
}

func (service *serviceStruct) CurriculumGroupCreate(in *CurriculumGroupCreateInput) (*CurriculumGroupCreateOutput, error) {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	curriculumGroup, err := service.schoolAffiliationStorage.CurriculumGroupCreate(tx, &constant.CurriculumGroupEntity{
		Name:      in.Name,
		ShortName: in.ShortName,
		Status:    in.Status,
		CreatedAt: time.Now().UTC(),
		CreatedBy: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	for i := 1; i <= 3; i++ {
		_, err := service.schoolAffiliationStorage.SubCriteriaCreate(tx, &constant.SubCriteriaEntity{
			CurriculumGroupId: curriculumGroup.Id,
			Index:             i,
			Name:              fmt.Sprintf(`มาตรฐานย่อย %d`, i),
		})
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &CurriculumGroupCreateOutput{
		curriculumGroup,
	}, nil
}
