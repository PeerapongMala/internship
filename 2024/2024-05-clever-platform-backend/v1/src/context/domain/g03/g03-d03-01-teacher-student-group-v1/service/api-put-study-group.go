package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api apiStruct) PutStudyGroup(c *fiber.Ctx) error {
	teacherID, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(c, &constant.PutStudyGroupBodyRequest{})
	if err != nil {
		errString := err.Error()
		return helper.RespondHttpError(c, helper.NewHttpErrorWithDetail(fiber.StatusBadRequest, &errString, err))
	}

	var statusCode int
	var message string
	if request.StudentGroupID != nil {
		err = api.service.CheckStudyGroup(c, *request.StudentGroupID)
		if err != nil {
			return helper.RespondHttpError(c, err)
		}

		err = api.service.UpdateStudyGroup(&constant.UpdateStudyGroup{
			ID:        *request.StudentGroupID,
			Name:      request.Name,
			ClassID:   request.ClassID,
			SubjectID: request.SubjectID,
			UserID:    teacherID,
			Status:    request.Status,
		})
		statusCode = fiber.StatusOK
		message = "updated success"
	} else {
		//err = api.service.CheckStudyGroupAccessByClassID(c, request.ClassID)
		//if err != nil {
		//	return helper.RespondHttpError(c, err)
		//}

		err = api.service.InsertStudyGroup(&constant.InsertStudyGroup{
			Name:      request.Name,
			ClassID:   request.ClassID,
			SubjectID: request.SubjectID,
			UserID:    teacherID,
			Status:    request.Status,
		})
		statusCode = fiber.StatusCreated
		message = "created success"
	}
	if err != nil {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	return c.Status(statusCode).JSON(fiber.Map{
		"status_code": statusCode,
		"message":     message,
	})
}

// ==================== Service ==========================
func (service serviceStruct) UpdateStudyGroup(data *constant.UpdateStudyGroup) error {
	return service.storage.UpdateStudyGroup(data)
}
func (service serviceStruct) InsertStudyGroup(data *constant.InsertStudyGroup) error {
	return service.storage.InsertStudyGroup(data)
}
