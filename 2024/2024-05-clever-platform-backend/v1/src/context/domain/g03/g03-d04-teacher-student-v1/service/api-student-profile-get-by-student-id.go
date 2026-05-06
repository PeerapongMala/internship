package service

import (
	"net/http"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type StudentProfileGetByStudentIdResponse struct {
	StatusCode int                      `json:"status_code"`
	Message    string                   `json:"message"`
	Data       *constant.StudentProfile `json:"data"`
}

func (api *APIStruct) StudentProfileGetByStudentId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	studentProfile, err := api.Service.StudentProfileGetByStudentId(studentId)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(StudentProfileGetByStudentIdResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Data:       studentProfile,
	})
}

func (service *serviceStruct) StudentProfileGetByStudentId(studentId string) (*constant.StudentProfile, error) {
	student, err := service.repositoryTeacherStudent.StudentByStudentId(studentId)
	if err != nil {
		return nil, err
	}

	studentProfile, err := service.repositoryAdminUserAccount.StudentGet(studentId)
	if err != nil {
		return nil, err
	}

	studentOauth, err := service.repositoryStorageAuth.AuthCaseGetUserOAuth(studentId)
	if err != nil {
		return nil, err
	}

	if student.UpdatedBy != nil {
		user, err := service.repositoryAdminUserAccount.UserGet(*student.UpdatedBy)
		if err != nil {
			return nil, err
		}
		updateBy := strings.Join([]string{
			user.FirstName,
			user.LastName,
		}, " ")
		studentProfile.UpdatedBy = &updateBy
	}

	return &constant.StudentProfile{
		StudentDataEntity: studentProfile,
		OAuthList:         studentOauth,
	}, nil
}
