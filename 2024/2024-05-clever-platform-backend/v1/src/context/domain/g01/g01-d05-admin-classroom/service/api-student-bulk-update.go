package service

import (
	"errors"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentBulkUpdateRequest struct {
	ClassRoomId int                     `params:"classRoomId" validate:"required"`
	Items       []StudentBulkUpdateItem `json:"items" validate:"required,dive,required"`
}

type StudentBulkUpdateItem struct {
	StudentId string `json:"student_id" validate:"required"`
	Action    string `json:"action" validate:"required,oneof=add delete"`
}

type StudentBulkUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// @Id G01D05A17Update
// @Tags Admin Classroom
// @Summary Bulk edit students in a classroom
// @Description อัพเดทรายชื่อนักเรียนหลายคนในห้องเรียนพร้อมกัน
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param request body StudentBulkUpdateRequest true "request"
// @Success 200 {object} StudentBulkUpdateResponse
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/students/bulk-edit [patch]
func (api *APiStruct) StudentBulkUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentBulkUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.StudentBulkUpdate(&StudentBulkUpdateInput{
		ClassRoomId: request.ClassRoomId,
		Items:       request.Items,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentBulkUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Students bulk updated successfully",
	})
}

type StudentBulkUpdateInput struct {
	ClassRoomId int
	Items       []StudentBulkUpdateItem
}

func (service *serviceStruct) StudentBulkUpdate(in *StudentBulkUpdateInput) error {
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
		student, err := service.storage.StudentGetByUserIdAndClassroom(tx, in.ClassRoomId, item.StudentId)
		if err != nil {
			return err
		}

		switch item.Action {
		case "add":
			if student != nil {
				msg := fmt.Sprintf("student_id %s already exists", item.StudentId)
				return helper.NewHttpError(http.StatusConflict, &msg)
			}

			err = service.storage.StudentAddToClassroom(tx, in.ClassRoomId, item.StudentId)
			if err != nil {
				return err
			}

		case "delete":
			if student == nil {
				msg := fmt.Sprintf("student_id %s does not exists", item.StudentId)
				return helper.NewHttpError(http.StatusNotFound, &msg)
			}

			err = service.storage.StudentDeleteFromClassroom(tx, in.ClassRoomId, item.StudentId)
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
