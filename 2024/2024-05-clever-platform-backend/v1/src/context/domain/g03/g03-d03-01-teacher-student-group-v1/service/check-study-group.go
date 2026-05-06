package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

// ==================== Service ==========================

// checking study group access by teacher id
func (service serviceStruct) CheckStudyGroup(c *fiber.Ctx, studentGroupID int) error {
	teacherID, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.NewHttpError(fiber.StatusInternalServerError, nil)
	}

	isExist, err := service.CheckStudyGroupExist(studentGroupID)
	if err != nil {
		errMsg := "error check is student-group exist"
		return helper.NewHttpError(fiber.StatusInternalServerError, &errMsg)
	}
	if !isExist {
		errMsg := "student group does not exist"
		return helper.NewHttpError(fiber.StatusNotFound, &errMsg)
	}

	isAccess, err := service.CheckStudyGroupAccess(studentGroupID, teacherID)
	if err != nil {
		errMsg := "error check is student-group exist"
		return helper.NewHttpError(fiber.StatusInternalServerError, &errMsg)
	}
	if !isAccess {
		errMsg := "only the class teacher or subject teacher can edit this study group"
		return helper.NewHttpError(fiber.StatusForbidden, &errMsg)
	}

	return nil
}
