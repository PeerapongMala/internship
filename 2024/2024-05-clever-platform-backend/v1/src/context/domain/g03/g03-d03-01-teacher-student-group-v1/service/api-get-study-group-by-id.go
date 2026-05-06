package service

import (
	"database/sql"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api apiStruct) GetStudyGroupById(c *fiber.Ctx) error {
	id := c.Params("study_group_id")
	studentGroupID, err := strconv.Atoi(id)
	if err != nil {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}

	teacherID, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	isExist, err := api.service.CheckStudyGroupExist(studentGroupID)
	if err != nil {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	if !isExist {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusNotFound, nil))
	}

	//err = api.service.CheckStudyGroup(c, studentGroupID)
	//if err != nil {
	//	return helper.RespondHttpError(c, err)
	//}

	studentGroup, err := api.service.GetStudyGroupById(studentGroupID, teacherID)
	if err != nil {
		if err == sql.ErrNoRows {
			return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusNotFound, nil))
		}
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data":        []constant.GetStudyGroupByIDResponse{*studentGroup},
		"message":     "Data retrieved",
		"status_code": fiber.StatusOK,
	})

}

// ==================== Service ==========================
func (service *serviceStruct) GetStudyGroupById(id int, teacherID string) (*constant.GetStudyGroupByIDResponse, error) {
	studentGroup, err := service.storage.GetStudyGroupById(id, teacherID)
	if err != nil {
		return nil, err
	}
	return studentGroup, nil
}
