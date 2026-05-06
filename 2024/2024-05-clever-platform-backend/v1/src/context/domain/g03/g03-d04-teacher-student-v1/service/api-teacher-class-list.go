package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherClassListRequest struct {
	AcademicYear string `query:"academic_year"`
	Year         string `query:"year"`
	SchoolId     int    `query:"school_id"`
}

type TeacherClassListResponse struct {
	Pagination *helper.Pagination     `json:"_pagination"`
	StatusCode int                    `json:"status_code"`
	Message    string                 `json:"message"`
	Data       []constant.ClassEntity `json:"data"`
}

func (api APIStruct) TeacherClassList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherClassListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationNew(context)
	classListOutput, err := api.Service.TeacherClassList(&TeacherClassListInput{
		SubjectId:               subjectId,
		Pagination:              pagination,
		TeacherClassListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherClassListResponse{
		Pagination: pagination,
		StatusCode: http.StatusOK,
		Message:    "Data retrieved",
		Data:       classListOutput.Classes,
	})
}

type TeacherClassListInput struct {
	SubjectId  string
	Pagination *helper.Pagination
	*TeacherClassListRequest
}

type TeacherClassListOutput struct {
	Classes []constant.ClassEntity
}

func (service *serviceStruct) TeacherClassList(in *TeacherClassListInput) (*TeacherClassListOutput, error) {
	classes, err := service.repositoryTeacherStudent.ClassList(in.Pagination, in.SubjectId, in.AcademicYear, in.Year, in.SchoolId)
	if err != nil {
		return nil, err
	}

	return &TeacherClassListOutput{
		Classes: classes,
	}, nil
}
