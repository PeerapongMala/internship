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

type SubCriteriaCaseListByCurriculumGroupIdResponse struct {
	StatusCode int                          `json:"status_code"`
	Data       []constant.SubCriteriaEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubCriteriaCaseListByCurriculumGroupId(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subCriteriaCaseListByCurriculumGroupIdOutput, err := api.Service.SubCriteriaCaseListByCurriculumGroupId(&SubCriteriaCaseListByCurriculumGroupIdInput{
		CurriculumGroupId: curriculumGroupId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubCriteriaCaseListByCurriculumGroupIdResponse{
		StatusCode: http.StatusOK,
		Data:       subCriteriaCaseListByCurriculumGroupIdOutput.SubCriteria,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubCriteriaCaseListByCurriculumGroupIdInput struct {
	CurriculumGroupId int
}

type SubCriteriaCaseListByCurriculumGroupIdOutput struct {
	SubCriteria []constant.SubCriteriaEntity
}

func (service *serviceStruct) SubCriteriaCaseListByCurriculumGroupId(in *SubCriteriaCaseListByCurriculumGroupIdInput) (*SubCriteriaCaseListByCurriculumGroupIdOutput, error) {
	subCriteria, err := service.repositoryStorage.SubCriteriaCaseListByCurriculumGroupId(in.CurriculumGroupId)
	if err != nil {
		return nil, err
	}

	return &SubCriteriaCaseListByCurriculumGroupIdOutput{
		SubCriteria: subCriteria,
	}, nil
}
