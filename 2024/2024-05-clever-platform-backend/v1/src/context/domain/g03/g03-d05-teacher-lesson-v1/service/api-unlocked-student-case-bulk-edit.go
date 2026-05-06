package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type UnlockedStudentCaseBulkEditRequest struct {
	ClassId    int      `params:"classId" validate:"required"`
	LevelId    int      `params:"levelId" validate:"required"`
	StudentIds []string `json:"student_ids" validate:"required"`
}

// ==================== Response ==========================

type UnlockedStudentCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UnlockedStudentCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &UnlockedStudentCaseBulkEditRequest{}, helper.ParseOptions{
		Params: true,
		Body:   true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.UnlockedStudentCaseBulkEdit(&UnlockedStudentCaseBulkEditInput{
		SubjectId:                          subjectId,
		UnlockedStudentCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(UnlockedStudentCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type UnlockedStudentCaseBulkEditInput struct {
	SubjectId string
	*UnlockedStudentCaseBulkEditRequest
}

func (service *serviceStruct) UnlockedStudentCaseBulkEdit(in *UnlockedStudentCaseBulkEditInput) error {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return err
	}

	err = service.teacherLessonStorage.UnlockedStudentCaseBulkDelete(in.ClassId, in.LevelId, in.StudentIds)
	if err != nil {
		return err
	}

	return nil
}
