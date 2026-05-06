package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LessonUnlockedStudentCaseBulkEditRequest struct {
	ClassId    int      `params:"classId" validate:"required"`
	LessonId   int      `params:"lessonId" validate:"required"`
	StudentIds []string `json:"student_ids" validate:"required"`
}

// ==================== Response ==========================

type LessonUnlockedStudentCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonUnlockedStudentCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonUnlockedStudentCaseBulkEditRequest{}, helper.ParseOptions{
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

	err = api.Service.LessonUnlockedStudentCaseBulkEdit(&LessonUnlockedStudentCaseBulkEditInput{
		SubjectId:                                subjectId,
		LessonUnlockedStudentCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonUnlockedStudentCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type LessonUnlockedStudentCaseBulkEditInput struct {
	SubjectId string
	*LessonUnlockedStudentCaseBulkEditRequest
}

func (service *serviceStruct) LessonUnlockedStudentCaseBulkEdit(in *LessonUnlockedStudentCaseBulkEditInput) error {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return err
	}

	err = service.teacherLessonStorage.LessonUnlockedStudentCaseBulkDelete(in.ClassId, in.LessonId, in.StudentIds)
	if err != nil {
		return err
	}

	return nil
}
