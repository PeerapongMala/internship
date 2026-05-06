package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type SubjectTemplateUpdateRequest struct {
	Id                *int                                      `params:"templateId" validate:"required"`
	Name              *string                                   `json:"name"`
	Status            *string                                   `json:"status"`
	SeedYearId        *int                                      `json:"seed_year_id"`
	SubjectId         *int                                      `json:"subject_id"`
	WizardIndex       *int                                      `json:"wizard_index"`
	IsIndicatorUpdate *bool                                     `json:"is_indicator_update"`
	Indicators        []constant.SubjectTemplateIndicatorEntity `json:"indicators"`
}

// ==================== Response ==========================

type SubjectTemplateUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectTemplateUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectTemplateUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SubjectTemplateUpdate(&SubjectTemplateUpdateInput{
		UserId:                       subjectId,
		SubjectTemplateUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectTemplateCreateResponse{
		StatusCode: http.StatusOK,
		Message:    "Updated",
	})
}

// ==================== Service ==========================

type SubjectTemplateUpdateInput struct {
	UserId string
	*SubjectTemplateUpdateRequest
}

func (service *serviceStruct) SubjectTemplateUpdate(in *SubjectTemplateUpdateInput) error {
	tx, err := service.subjectTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.subjectTemplateStorage.SubjectTemplateUpdate(tx, &constant.SubjectTemplateEntity{
		Id:          in.Id,
		Name:        in.Name,
		Status:      in.Status,
		WizardIndex: in.WizardIndex,
		UpdatedAt:   helper.ToPtr(time.Now().UTC()),
		UpdatedBy:   &in.UserId,
	})
	if err != nil {
		return err
	}

	if helper.Deref(in.IsIndicatorUpdate) {
		err = service.subjectTemplateStorage.SubjectTemplateIndicatorUpdate(tx, helper.Deref(in.Id), in.Indicators)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
