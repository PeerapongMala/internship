package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectCheckinGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.CheckinEntity{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if request.AdminLoginAs != nil {
		subjectCheckin, err := api.Service.SubjectCheckinGetByAdmin(request.StudentId, request.SubjectId, request.AdminLoginAs)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		return context.Status(fiber.StatusOK).JSON(DataGetResponse{
			Data:    []constant.SubjectCheckinEntity{*subjectCheckin},
			Message: "Data retrieved",
		})
	} else {
		subjectCheckin, err := api.Service.SubjectCheckinGet(request.StudentId, request.SubjectId)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}

		return context.Status(fiber.StatusOK).JSON(DataGetResponse{
			Data:    []constant.SubjectCheckinEntity{*subjectCheckin},
			Message: "Data retrieved",
		})
	}
}

// ==================== Service ==========================

func (service *serviceStruct) SubjectCheckinGet(studentId string, subjectId int) (*constant.SubjectCheckinEntity, error) {
	subjectCheckin, err := service.subjectCheckinStorage.GetSubjectCheckin(studentId, subjectId)
	if err != nil {
		return nil, err
	}

	return subjectCheckin, nil
}

func (service *serviceStruct) SubjectCheckinGetByAdmin(studentId string, subjectId int, adminLoginAs *string) (*constant.SubjectCheckinEntity, error) {
	subjectCheckin, err := service.subjectCheckinStorage.GetSubjectCheckinByAdmin(studentId, subjectId, adminLoginAs)
	if err != nil {
		return nil, err
	}

	return subjectCheckin, nil
}
