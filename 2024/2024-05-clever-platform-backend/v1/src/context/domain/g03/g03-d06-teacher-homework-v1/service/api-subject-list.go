package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type SubjectListRequest struct {
	SchoolId   int `params:"schoolId"`
	*constant.SubjectListFilter
	Pagination *helper.Pagination
}

// ==================== Response ==========================

type SubjectListResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.SubjectListEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectList(context *fiber.Ctx) error {
	
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &SubjectListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	
	request.Pagination = pagination
	
	resp, err := api.Service.SubjectList(&SubjectListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       resp.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectListInput struct {
	*SubjectListRequest
}

type SubjectListOutput struct {
	Subjects []constant.SubjectListEntity
}

func (service *serviceStruct) SubjectList(in *SubjectListInput) (*SubjectListOutput, error) {
	
	subjects, err := service.teacherHomeworkStorage.GetSubjectBySchoolId(in.SchoolId, in.Pagination, in.SubjectListFilter)
	if err != nil {
		return nil, err
	}

	return &SubjectListOutput{
		Subjects: subjects,
	}, nil
}
