package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LessonUnlockedForStudentCreateRequest struct {
	LessonId   int      `params:"lessonId" validate:"required"`
	StudentIds []string `json:"student_ids" validate:"required"`
	ClassId    int      `json:"class_id" validate:"required"`
}

// ==================== Response ==========================

type LessonUnlockedForStudentCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonUnlockedForStudentCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonUnlockedForStudentCreateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.LessonUnlockedForStudentCreate(&LessonUnlockedForStudentCreateInput{
		SubjectId:                             subjectId,
		LessonUnlockedForStudentCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(LessonUnlockedForStudentCreateResponse{
		StatusCode: http.StatusCreated,
		Message:    "Student added",
	})
}

// ==================== Service ==========================

type LessonUnlockedForStudentCreateInput struct {
	SubjectId string
	*LessonUnlockedForStudentCreateRequest
}

func (service *serviceStruct) LessonUnlockedForStudentCreate(in *LessonUnlockedForStudentCreateInput) error {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return err
	}

	lessonUnlockedForStudentList := []constant.LessonUnlockedForStudent{}
	for _, studentId := range in.StudentIds {
		lessonUnlockedForStudentList = append(lessonUnlockedForStudentList, constant.LessonUnlockedForStudent{
			LessonId:  in.LessonId,
			StudentId: studentId,
			ClassId:   in.ClassId,
		})
	}
	err = service.teacherLessonStorage.LessonUnlockedForStudentCreate(lessonUnlockedForStudentList)
	if err != nil {
		return err
	}

	return nil
}
