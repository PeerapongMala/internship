package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type SubjectListRequest struct {
	SchoolId     int    `query:"school_id" validate:"required"`
	AcademicYear string `query:"academic_year"`
}

type SubjectListResponse struct {
	StatusCode int      `json:"status_code"`
	Data       []string `json:"data"`
	Message    string   `json:"message"`
}

func (api *APIStruct) SubjectList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectListOutput, err := api.Service.SubjectList(&SubjectListInput{
		SubjectListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectListResponse{
		StatusCode: http.StatusOK,
		Data:       subjectListOutput.Subjects,
		Message:    "Data retrieved",
	})
}

type SubjectListInput struct {
	*SubjectListRequest
}

type SubjectListOutput struct {
	Subjects []string
}

func (service *serviceStruct) SubjectList(in *SubjectListInput) (*SubjectListOutput, error) {
	subjects, err := service.gradeDataEntryStorage.SubjectList(in.SchoolId, in.AcademicYear)
	if err != nil {
		return nil, err
	}

	return &SubjectListOutput{
		Subjects: subjects,
	}, nil
}
