package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherDeleteRequest struct {
	ClassRoomId int    `params:"classRoomId" validate:"required"`
	TeacherId   string `params:"teacherId" validate:"required"`
}

// @Id G01D05A15Delete
// @Tags Admin Classroom
// @Summary Delete a teacher from a classroom
// @Description ลบครูออกจากห้องเรียน
// @Security BearerAuth
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param teacherId path string true "teacherId"
// @Success 200 {object} fiber.Map
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/teachers/{teacherId} [delete]
func (api *APiStruct) TeacherDelete(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherDeleteRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.TeacherDelete(&TeacherDeleteInput{
		ClassRoomId: request.ClassRoomId,
		TeacherId:   request.TeacherId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{
		"status_code": http.StatusOK,
		"message":     "Teacher deleted from classroom",
	})
}

type TeacherDeleteInput struct {
	ClassRoomId int
	TeacherId   string
}

func (service *serviceStruct) TeacherDelete(in *TeacherDeleteInput) error {
	teacher, err := service.storage.TeacherGetByUserIdAndClassroom(nil, in.ClassRoomId, in.TeacherId)
	if err != nil {
		return err
	}
	if teacher == nil {
		msg := "teacher not found"
		return helper.NewHttpError(http.StatusNotFound, &msg)
	}

	err = service.storage.TeacherDeleteFromClassroom(nil, in.ClassRoomId, in.TeacherId)
	if err != nil {
		return err
	}

	return nil
}
