package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/constant"
	"github.com/gofiber/fiber/v2"
)

type ServiceInterface interface {
	UpdateStudyGroup(data *constant.UpdateStudyGroup) error
	InsertStudyGroup(data *constant.InsertStudyGroup) error
	GetStudyGroupById(id int, teacherID string) (*constant.GetStudyGroupByIDResponse, error)
	CheckStudyGroup(c *fiber.Ctx, studentGroupID int) error
	CheckStudyGroupAccess(studentGroupID int, userID string) (bool, error)
	CheckStudyGroupExist(studentGroupID int) (bool, error)
	CheckStudyGroupAccessByClassID(c *fiber.Ctx, classID int) error
}
