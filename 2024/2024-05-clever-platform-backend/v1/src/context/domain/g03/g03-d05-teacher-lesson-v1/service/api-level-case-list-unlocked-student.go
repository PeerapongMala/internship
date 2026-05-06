package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LevelCaseListUnlockedStudentRequest struct {
	ClassId int `params:"classId" validate:"required"`
	LevelId int `params:"levelId" validate:"required"`
}

// ==================== Response ==========================

type LevelCaseListUnlockedStudentResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.StudentEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseListUnlockedStudent(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LevelCaseListUnlockedStudentRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	levelCaseListUnlockedStudentOutput, err := api.Service.LevelCaseListUnlockedStudent(&LevelCaseListUnlockedStudentInput{
		Pagination:                          pagination,
		SubjectId:                           subjectId,
		LevelCaseListUnlockedStudentRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelCaseListUnlockedStudentResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelCaseListUnlockedStudentOutput.Students,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelCaseListUnlockedStudentInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*LevelCaseListUnlockedStudentRequest
}

type LevelCaseListUnlockedStudentOutput struct {
	Students []constant.StudentEntity
}

func (service *serviceStruct) LevelCaseListUnlockedStudent(in *LevelCaseListUnlockedStudentInput) (*LevelCaseListUnlockedStudentOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	students, err := service.teacherLessonStorage.LevelCaseListUnlockedStudent(in.ClassId, in.LevelId, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &LevelCaseListUnlockedStudentOutput{
		students,
	}, nil
}
