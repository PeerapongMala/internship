package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SchoolAffiliationGetResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SchoolAffiliationGet(context *fiber.Ctx) error {
	schoolAffiliationId, err := context.ParamsInt("schoolAffiliationId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	schoolAffiliationGetOutput, err := api.Service.SchoolAffiliationGet(&SchoolAffiliationGetInput{
		SchoolAffiliationId: schoolAffiliationId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationGetResponse{
		StatusCode: http.StatusOK,
		Data:       []interface{}{schoolAffiliationGetOutput.SchoolAffiliation},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolAffiliationGetInput struct {
	SchoolAffiliationId int
}

type SchoolAffiliationOutput struct {
	SchoolAffiliation interface{}
}

func (service *serviceStruct) SchoolAffiliationGet(in *SchoolAffiliationGetInput) (*SchoolAffiliationOutput, error) {
	schoolAffiliation, err := service.schoolAffiliationStorage.SchoolAffiliationGet(in.SchoolAffiliationId)
	if err != nil {
		return nil, err
	}

	var outputSchoolAffiliation interface{}

	switch schoolAffiliation.SchoolAffiliationGroup {
	case string(constant.Lao):
		schoolAffiliationLao, err := service.schoolAffiliationStorage.SchoolAffiliationLaoGet(in.SchoolAffiliationId)
		if err != nil {
			return nil, err
		}

		outputSchoolAffiliation = constant.SchoolAffiliationLaoDataEntity{
			SchoolAffiliationEntity:    schoolAffiliation,
			SchoolAffiliationLaoEntity: schoolAffiliationLao,
		}
	case string(constant.Obec):
		schoolAffiliationObec, err := service.schoolAffiliationStorage.SchoolAffiliationObecGet(in.SchoolAffiliationId)
		if err != nil {
			return nil, err
		}

		outputSchoolAffiliation = constant.SchoolAffiliationObecDataEntity{
			SchoolAffiliationEntity:     schoolAffiliation,
			SchoolAffiliationObecEntity: schoolAffiliationObec,
		}
	case string(constant.Doe):
		schoolAffiliationDoe, err := service.schoolAffiliationStorage.SchoolAffiliationDoeGet(in.SchoolAffiliationId)
		if err != nil {
			return nil, err
		}

		outputSchoolAffiliation = constant.SchoolAffiliationDoeDataEntity{
			SchoolAffiliationEntity:    schoolAffiliation,
			SchoolAffiliationDoeEntity: schoolAffiliationDoe,
		}
	default:
		outputSchoolAffiliation = constant.SchoolAffiliationDoeDataEntity{
			SchoolAffiliationEntity: schoolAffiliation,
		}
	}

	return &SchoolAffiliationOutput{
		outputSchoolAffiliation,
	}, nil
}
