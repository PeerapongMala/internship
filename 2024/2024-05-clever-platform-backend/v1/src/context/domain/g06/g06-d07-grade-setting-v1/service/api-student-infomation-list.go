package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentInformationListRequest struct {
	constant.GradeEvaluationStudentFilter
	Pagination *helper.Pagination
}

// ==================== Response ==========================

type StudentInformationListResponse struct {
	StatusCode int                                           `json:"status_code"`
	Pagination *helper.Pagination                            `json:"_pagination"`
	Data       []constant.GradeEvaluationStudentFilterResult `json:"data"`
	Message    string                                        `json:"message"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) StudentInformationList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentInformationListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request.Pagination = helper.PaginationNew(context)

	output, err := api.Service.StudentInformationList(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentInformationListResponse{
		StatusCode: http.StatusOK,
		Pagination: request.Pagination,
		Data:       output,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) StudentInformationList(in *StudentInformationListRequest) ([]constant.GradeEvaluationStudentFilterResult, error) {
	list, err := service.gradeSettingStorage.GradeEvaluationStudentList(in.GradeEvaluationStudentFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return list, nil
}
