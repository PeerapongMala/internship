package service

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================
type TeacherCommentUpdateRequest struct {
	CommentId    int
	Text         string `json:"text" validate:"required"`
	UpdatedBy    string
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================
type TeacherCommentUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCommentUpdate(context *fiber.Ctx) error {

	commentIdStr := context.Params("commentId")
	if commentIdStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	commentId, err := strconv.Atoi(commentIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &TeacherCommentUpdateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if request == nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.CommentId = commentId
	request.UpdatedBy = teacherId

	if err := api.Service.TeacherCommentUpdate(*request); err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherCommentDeleteResponse{
		StatusCode: http.StatusOK,
		Message:    fmt.Sprintf("Update TeacherComment id: %v Successfully", commentId),
	})
}

// ==================== Service ==========================
func (service *serviceStruct) TeacherCommentUpdate(in TeacherCommentUpdateRequest) error {

	req := constant.TeacherCommentUpdate{
		CommentId:    in.CommentId,
		Text:         in.Text,
		UpdatedAt:    time.Now().UTC(),
		UpdatedBy:    in.UpdatedBy,
		AdminLoginAs: in.AdminLoginAs,
	}

	if err := service.repositoryTeacherStudent.TeacherCommentUpdate(req); err != nil {
		return err
	}
	return nil
}
