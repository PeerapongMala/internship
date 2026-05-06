package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SubjectListRequest struct {
	constant.SubjectFilter
}

// ==================== Response ==========================

type SubjectListResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

func (api *APIStruct) SubjectList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &SubjectListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectListOutput, err := api.Service.SubjectList(&SubjectListInput{
		Pagination:         pagination,
		SubjectListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectListOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectListInput struct {
	Pagination *helper.Pagination
	*SubjectListRequest
}

type SubjectListOutput struct {
	Subjects []constant.SubjectEntity
}

func (service *serviceStruct) SubjectList(in *SubjectListInput) (*SubjectListOutput, error) {
	subjects, err := service.adminReportStorage.SubjectList(in.Pagination, &constant.SubjectFilter{
		UserId:            in.UserId,
		CurriculumGroupId: in.CurriculumGroupId,
	})
	if err != nil {
		return nil, err
	}

	return &SubjectListOutput{
		subjects,
	}, nil
}
