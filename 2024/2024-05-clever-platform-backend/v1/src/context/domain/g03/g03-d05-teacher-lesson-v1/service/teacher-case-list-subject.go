package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ClassLessonCaseListSubjectRequest struct {
	ClassId int `params:"classId" validate:"required"`
	constant.SubjectFilter
}

type ClassLessonCaseListSubjectResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCaseListSubject(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &ClassLessonCaseListSubjectRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	classLessonCaseListSubjectOutput, err := api.Service.TeacherCaseListSubject(&ClassLessonCaseListSubjectInput{
		Pagination:                        pagination,
		SubjectId:                         subjectId,
		ClassLessonCaseListSubjectRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassLessonCaseListSubjectResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       classLessonCaseListSubjectOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ClassLessonCaseListSubjectInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*ClassLessonCaseListSubjectRequest
}

type ClassLessonCaseListSubjectOutput struct {
	Subjects []constant.SubjectEntity
}

func (service *serviceStruct) TeacherCaseListSubject(in *ClassLessonCaseListSubjectInput) (*ClassLessonCaseListSubjectOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	subjects, err := service.teacherLessonStorage.TeacherCaseListSubject(in.SubjectId, in.ClassId, in.SubjectFilter, in.Pagination, in.IsParent)
	if err != nil {
		return nil, err
	}

	return &ClassLessonCaseListSubjectOutput{subjects}, nil
}
