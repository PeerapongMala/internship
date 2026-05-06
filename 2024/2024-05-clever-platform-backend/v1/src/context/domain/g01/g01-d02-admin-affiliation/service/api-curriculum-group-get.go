package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================
type CurriculumGroupGetResponse struct {
	StatusCode int                              `json:"status_code"`
	Data       []constant.CurriculumGroupEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupGet(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	curriculumGroupGetOutput, err := api.Service.CurriculumGroupGet(&CurriculumGroupGetInput{
		CurriculumGroupId: curriculumGroupId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CurriculumGroupGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.CurriculumGroupEntity{*curriculumGroupGetOutput.CurriculumGroupEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type CurriculumGroupGetInput struct {
	CurriculumGroupId int
}

type CurriculumGroupGetOutput struct {
	*constant.CurriculumGroupEntity
}

func (service *serviceStruct) CurriculumGroupGet(in *CurriculumGroupGetInput) (*CurriculumGroupGetOutput, error) {
	curriculumGroup, err := service.schoolAffiliationStorage.CurriculumGroupGet(in.CurriculumGroupId)
	if err != nil {
		return nil, err
	}

	return &CurriculumGroupGetOutput{
		curriculumGroup,
	}, nil
}
