package service

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type TeacherCommentDeleteRequest struct {
	CommentId int
}

// ==================== Response ==========================
type TeacherCommentDeleteResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCommentDelete(context *fiber.Ctx) error {

	commentIdStr := context.Params("commentId")
	if commentIdStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	commentId, err := strconv.Atoi(commentIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if err := api.Service.TeacherCommentDelete(TeacherCommentDeleteRequest{commentId}); err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherCommentDeleteResponse{
		StatusCode: http.StatusOK,
		Message:    fmt.Sprintf("Delete TeacherComment id: %v Successfully", commentId),
	})
}

// ==================== Service ==========================
func (service *serviceStruct) TeacherCommentDelete(in TeacherCommentDeleteRequest) error {
	if err := service.repositoryTeacherStudent.TeacherCommentDelete(in.CommentId); err != nil {
		return err
	}
	return nil
}
