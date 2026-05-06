package service

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) StudentGet(context *fiber.Ctx) error {
	studentId := context.Params("userId")
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	response, err := api.Service.StudentGet(studentId, subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "data received",
	})

}
func (service *serviceStruct) StudentGet(studentId string, teacherId string) (*constant.StudentGet, error) {
	schoolId, err := service.teacherRewardStorage.GetSchoolIdByTeacherId(teacherId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	response, err := service.teacherRewardStorage.StudentGet(studentId, schoolId)
	if err != nil {
		if err == sql.ErrNoRows {
			msg := "no data found"
			return nil, helper.NewHttpError(http.StatusNotFound, &msg)
		}
		return nil, err
	}

	return response, nil
}
