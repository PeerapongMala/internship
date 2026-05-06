package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentMoveRequest struct {
	ClassRoomId int    `params:"classRoomId" validate:"required"`
	StudentId   string `params:"studentId" validate:"required"`
}

// @Id G01D05A23Create
// @Tags Admin Classroom
// @Summary Move a student to another classroom
// @Description ย้ายนักเรียนไปยังห้องเรียนใหม่
// @Security BearerAuth
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param studentId path string true "studentId"
// @Success 201 {object} fiber.Map
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/students/{studentId} [post]
func (api *APiStruct) StudentMove(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentMoveRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.StudentMove(&StudentMoveInput{
		ClassRoomId: request.ClassRoomId,
		StudentId:   request.StudentId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(fiber.Map{
		"status_code": http.StatusCreated,
		"message":     "Student moved to the new classroom",
	})
}

type StudentMoveInput struct {
	ClassRoomId int
	StudentId   string
}

func (service *serviceStruct) StudentMove(in *StudentMoveInput) error {
	classroom, err := service.storage.ClassGet(in.ClassRoomId)
	if err != nil {
		return err
	}
	if classroom == nil {
		return helper.NewHttpErrorWithDetail(http.StatusNotFound, nil, fmt.Errorf("classroom id %v not found", in.ClassRoomId))
	}
	return service.storage.StudentMove(in.ClassRoomId, in.StudentId)
}
