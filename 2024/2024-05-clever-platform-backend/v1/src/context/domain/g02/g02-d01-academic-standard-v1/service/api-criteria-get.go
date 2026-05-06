package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type CriteriaGetResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.CriteriaEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) CriteriaGet(context *fiber.Ctx) error {
	criteriaId, err := context.ParamsInt("criteriaId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	criteriaGetOutput, err := api.Service.CriteriaGet(&CriteriaGetInput{
		CriteriaId: criteriaId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CriteriaGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.CriteriaEntity{*criteriaGetOutput.CriteriaEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type CriteriaGetInput struct {
	CriteriaId int
}

type CriteriaGetOutput struct {
	*constant.CriteriaEntity
}

func (service *serviceStruct) CriteriaGet(in *CriteriaGetInput) (*CriteriaGetOutput, error) {
	criteria, err := service.repositoryStorage.CriteriaGet(in.CriteriaId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &CriteriaGetOutput{
		criteria,
	}, nil
}
