package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type HomeworkTemplateListRequest struct {
	SchoolId   int `params:"schoolId"`
	SubjectId  int `params:"subjectid"`
	Pagination *helper.Pagination
	*constant.HomeWorkTemplateListFilter
}

// ==================== Response ==========================

type HomeworkTemplateListResponse struct {
	StatusCode int                                   `json:"status_code"`
	Pagination *helper.Pagination                    `json:"_pagination"`
	Data       []constant.HomeworkTemplateListEntity `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkTemplateList(context *fiber.Ctx) error {

	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &HomeworkTemplateListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	request.Pagination = pagination
	resp, err := api.Service.HomeworkTemplateList(&HomeworkTemplateListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkTemplateListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       resp.HomeworkTemplates,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type HomeworkTemplateListInput struct {
	*HomeworkTemplateListRequest
}

type HomeworkTemplateListOutput struct {
	HomeworkTemplates []constant.HomeworkTemplateListEntity
}

func (service *serviceStruct) HomeworkTemplateList(in *HomeworkTemplateListInput) (*HomeworkTemplateListOutput, error) {


	homeworkTemplates, err := service.teacherHomeworkStorage.GetHomeworkTemplateBySchoolIdAndSubjectId(in.SchoolId, in.SubjectId, in.Pagination, in.HomeWorkTemplateListFilter)
	if err != nil {
		return nil, err
	}

	return &HomeworkTemplateListOutput{
		HomeworkTemplates: homeworkTemplates,
	}, nil
}
