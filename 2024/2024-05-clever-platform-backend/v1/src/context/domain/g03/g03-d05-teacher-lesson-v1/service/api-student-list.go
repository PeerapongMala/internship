package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type StudentListRequest struct {
	ClassId int `params:"classId" validate:"required"`
	constant.StudentFilter
}

// ==================== Response ==========================

type StudentListResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.StudentEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &StudentListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studentListOutput, err := api.Service.StudentList(&StudentListInput{
		Pagination:         pagination,
		SubjectId:          subjectId,
		StudentListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       studentListOutput.Students,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentListInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*StudentListRequest
}

type StudentListOutput struct {
	Students []constant.StudentEntity
}

func (service *serviceStruct) StudentList(in *StudentListInput) (*StudentListOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	students, err := service.teacherLessonStorage.StudentList(in.ClassId, in.StudentFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &StudentListOutput{
		students,
	}, nil
}
