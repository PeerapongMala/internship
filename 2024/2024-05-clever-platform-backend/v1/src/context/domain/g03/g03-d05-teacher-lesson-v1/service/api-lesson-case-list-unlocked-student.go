package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LessonCaseListUnlockedStudentRequest struct {
	ClassId  int `params:"classId" validate:"required"`
	LessonId int `params:"lessonId" validate:"required"`
}

// ==================== Response ==========================

type LessonCaseListUnlockedStudentResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.StudentEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseListUnlockedStudent(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LessonCaseListUnlockedStudentRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	lessonCaseListUnlockedStudentOutput, err := api.Service.LessonCaseListUnlockedStudent(&LessonCaseListUnlockedStudentInput{
		Pagination:                           pagination,
		SubjectId:                            subjectId,
		LessonCaseListUnlockedStudentRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonCaseListUnlockedStudentResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       lessonCaseListUnlockedStudentOutput.Students,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LessonCaseListUnlockedStudentInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*LessonCaseListUnlockedStudentRequest
}

type LessonCaseListUnlockedStudentOutput struct {
	Students []constant.StudentEntity
}

func (service *serviceStruct) LessonCaseListUnlockedStudent(in *LessonCaseListUnlockedStudentInput) (*LessonCaseListUnlockedStudentOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	students, err := service.teacherLessonStorage.LessonCaseListUnlockedStudent(in.ClassId, in.LessonId, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &LessonCaseListUnlockedStudentOutput{students}, nil
}
