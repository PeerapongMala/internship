package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentDeleteRequest struct {
	ClassRoomId int    `params:"classRoomId" validate:"required"`
	StudentId   string `params:"studentId" validate:"required"`
}

// @Id G01D05A22Delete
// @Tags Admin Classroom
// @Summary Delete a student from classroom
// @Description ลบนักเรียนออกจากห้องเรียน
// @Security BearerAuth
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param studentId path string true "studentId"
// @Success 200 {object} fiber.Map
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/students/{studentId} [delete]
func (api *APiStruct) StudentDelete(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentDeleteRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.StudentDelete(&StudentDeleteInput{
		ClassRoomId: request.ClassRoomId,
		StudentId:   request.StudentId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{
		"status_code": http.StatusOK,
		"message":     "Student deleted from classroom",
	})
}

type StudentDeleteInput struct {
	ClassRoomId int
	StudentId   string
}

func (service *serviceStruct) StudentDelete(in *StudentDeleteInput) error {
	return service.storage.StudentDeleteFromClassroom(nil, in.ClassRoomId, in.StudentId)
}
