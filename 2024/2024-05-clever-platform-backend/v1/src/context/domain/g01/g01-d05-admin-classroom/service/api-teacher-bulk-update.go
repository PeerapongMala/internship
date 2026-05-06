package service

import (
	"errors"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherBulkUpdateRequest struct {
	ClassRoomId int                     `params:"classRoomId" validate:"required"`
	Items       []TeacherBulkUpdateItem `json:"items" validate:"required,dive,required"`
}

type TeacherBulkUpdateItem struct {
	TeacherID string `json:"teacher_id" validate:"required"`
	Action    string `json:"action" validate:"required,oneof=add delete"`
}

type TeacherBulkUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// @Id G01D05A11Update
// @Tags Admin Classroom
// @Summary Bulk update teachers in a classroom
// @Description อัพเดทครูหลายคนในห้องเรียนพร้อมกัน
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param request body TeacherBulkUpdateRequest true "request"
// @Success 200 {object} TeacherBulkUpdateResponse
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/teachers/bulk-edit [patch]
func (api *APiStruct) TeacherBulkUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherBulkUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.TeacherBulkUpdate(&TeacherBulkUpdateInput{
		SubjectId:   subjectId,
		ClassRoomId: request.ClassRoomId,
		Items:       request.Items,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherBulkUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Teachers bulk updated",
	})
}

type TeacherBulkUpdateInput struct {
	SubjectId   string
	ClassRoomId int
	Items       []TeacherBulkUpdateItem
}

func (service *serviceStruct) TeacherBulkUpdate(in *TeacherBulkUpdateInput) error {
	classroom, err := service.storage.ClassGet(in.ClassRoomId)
	if err != nil {
		return err
	}
	if classroom == nil {
		msg := fmt.Sprintf("classroom id %d does not exist", in.ClassRoomId)
		return helper.NewHttpError(http.StatusNotFound, &msg)
	}

	tx, err := service.storage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, item := range in.Items {
		teacher, err := service.storage.TeacherGetByUserIdAndClassroom(tx, in.ClassRoomId, item.TeacherID)
		if err != nil {
			return err
		}

		switch item.Action {
		case "add":
			if teacher != nil {
				msg := fmt.Sprintf("teacher_id %s already exists", item.TeacherID)
				return helper.NewHttpError(http.StatusConflict, &msg)
			}

			err = service.storage.TeacherAddToClassroom(tx, in.ClassRoomId, item.TeacherID)
			if err != nil {
				return err
			}

		case "delete":
			if teacher == nil {
				msg := fmt.Sprintf("teacher_id %s does not exists", item.TeacherID)
				return helper.NewHttpError(http.StatusNotFound, &msg)
			}

			err = service.storage.TeacherDeleteFromClassroom(tx, in.ClassRoomId, item.TeacherID)
			if err != nil {
				return err
			}

		default:
			return errors.New("invalid action")
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
