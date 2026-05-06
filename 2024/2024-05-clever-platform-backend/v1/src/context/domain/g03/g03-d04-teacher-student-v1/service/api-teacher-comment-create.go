package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================
type TeacherCommentCreateRequest struct {
	constant.TeacherCommentCreateDTO
	StudentId string `json:"student_id" validate:"required"`
}

// ==================== Response ==========================
type TeacherCommentCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCommentCreate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &TeacherCommentCreateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if request == nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.TeacherUserId = teacherId

	if err := api.Service.TeacherCommentCreate(*request); err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherCommentCreateResponse{
		StatusCode: http.StatusOK,
		Message:    "Create TeacherComment Successfully",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) TeacherCommentCreate(in TeacherCommentCreateRequest) error {
	student, err := service.repositoryTeacherStudent.StudentByStudentId(in.StudentId)
	if err != nil {
		return err
	}

	in.StudentUserId = student.Id
	in.CreatedAt = time.Now().UTC()
	in.CreatedBy = in.TeacherUserId
	if err := service.repositoryTeacherStudent.TeacherCommentCreate(in.TeacherCommentCreateDTO); err != nil {
		return err
	}

	return nil
}
