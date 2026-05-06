package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func (service serviceStruct) CheckStudyGroupAccessByClassID(c *fiber.Ctx, classID int) error {
	teacherID, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.NewHttpError(fiber.StatusInternalServerError, nil)
	}

	isAccess, err := service.storage.CheckStudyGroupByClassID(classID, teacherID)
	if err != nil {
		errMsg := "error check study group access by class id"
		return helper.NewHttpErrorWithDetail(fiber.StatusInternalServerError, &errMsg, err)
	}
	if !isAccess {
		errMsg := "only the class teacher or subject teacher can edit this study group"
		return helper.NewHttpErrorWithDetail(fiber.StatusForbidden, &errMsg, nil)
	}

	return nil
}
