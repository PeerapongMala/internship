package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type StudentFamilyMemberByStudentIdResponse struct {
	StatusCode int                            `json:"status_code"`
	Message    string                         `json:"message"`
	Data       []constant.StudentFamilyEntity `json:"data"`
}

func (api *APIStruct) StudentFamilyMemberByStudentId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	familyMember, err := api.Service.StudentFamilyMemberByStudentId(studentId)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(StudentFamilyMemberByStudentIdResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Data:       familyMember,
	})
}

func (service *serviceStruct) StudentFamilyMemberByStudentId(studentId string) ([]constant.StudentFamilyEntity, error) {
	return service.repositoryTeacherStudent.StudentFamilyMemberByStudentId(studentId)
}
