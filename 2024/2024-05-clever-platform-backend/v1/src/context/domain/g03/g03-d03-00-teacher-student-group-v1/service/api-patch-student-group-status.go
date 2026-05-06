package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-00-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api apiStruct) PatchStudyGroupsStatus(c *fiber.Ctx) error {
	teacherId, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(c, &constant.UpdateStudyGroupsStatusRequest{}, helper.ParseOptions{
		Body: true,
	})
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	api.service.PatchStudentGroupsStatus(teacherId, request.Items)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status_code": fiber.StatusOK,
		"message":     "update success",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) PatchStudentGroupsStatus(teacherId string, items []constant.UpdateStudyGroupsStatusItem) error {
	return service.storage.UpdatesStudentGroupStatus(teacherId, teacherId, items)
}
