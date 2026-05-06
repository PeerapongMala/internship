package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================
type TeacherSubjectListRequest struct {
	Year string `query:"year"`
}

// ==================== Response ==========================

type TeacherSubjectListResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       []constant.Subject `json:"data"`
	Message    string             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) TeacherSubjectList(context *fiber.Ctx) error {
	pagination := helper.PaginationDropdown(context)
	request, err := helper.ParseAndValidateRequest(context, &TeacherSubjectListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectTemplateListOutput, err := api.service.TeacherSubjectList(&TeacherSubjectListInput{
		UserId:     subjectId,
		Pagination: pagination,
		Year:       request.Year,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherSubjectListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectTemplateListOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TeacherSubjectListInput struct {
	UserId     string
	Pagination *helper.Pagination
	Year       string
}

type TeacherSubjectListOutput struct {
	Subjects []constant.Subject
}

func (service *serviceStruct) TeacherSubjectList(in *TeacherSubjectListInput) (*TeacherSubjectListOutput, error) {
	subjects, err := service.storage.TeacherSubjectList(in.UserId, in.Pagination, in.Year)
	if err != nil {
		return nil, err
	}
	return &TeacherSubjectListOutput{
		Subjects: subjects,
	}, nil
}
