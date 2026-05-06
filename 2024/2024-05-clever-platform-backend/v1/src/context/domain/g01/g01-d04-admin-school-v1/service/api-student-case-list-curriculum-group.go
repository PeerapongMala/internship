package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentCaseListCurriculumGroupResponse struct {
	StatusCode int                              `json:"status_code"`
	Data       []constant.CurriculumGroupEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseListCurriculumGroup(context *fiber.Ctx) error {
	userId := context.Params("userId")

	filter, err := helper.ParseAndValidateRequest(context, &constant.CurriculumGroupFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))

	}

	studentCaseListCurriculumGroupOutput, err := api.Service.StudentCaseListCurriculumGroup(&StudentCaseListCurriculumGroupInput{
		UserId: userId,
		Filter: filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseListCurriculumGroupResponse{
		StatusCode: http.StatusOK,
		Data:       studentCaseListCurriculumGroupOutput.CurriculumGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseListCurriculumGroupInput struct {
	UserId string
	Filter *constant.CurriculumGroupFilter
}

type StudentCaseListCurriculumGroupOutput struct {
	CurriculumGroups []constant.CurriculumGroupEntity
}

func (service *serviceStruct) StudentCaseListCurriculumGroup(in *StudentCaseListCurriculumGroupInput) (*StudentCaseListCurriculumGroupOutput, error) {
	curriculumGroups, err := service.adminSchoolStorage.StudentCaseListCurriculumGroup(in.UserId, in.Filter)
	if err != nil {
		return nil, err
	}

	return &StudentCaseListCurriculumGroupOutput{
		CurriculumGroups: curriculumGroups,
	}, nil
}
