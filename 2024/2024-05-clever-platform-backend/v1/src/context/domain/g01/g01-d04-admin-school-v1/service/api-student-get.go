package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentGetResponse struct {
	StatusCode int                                   `json:"status_code"`
	Data       []constant.StudentDataWithOauthEntity `json:"data"`
	Message    string                                `json:"message"`
}

func (api *APIStruct) StudentGet(context *fiber.Ctx) error {
	userId := context.Params("userId")

	studentGetOutput, err := api.Service.StudentGet(&StudentGetInput{
		UserId: userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.StudentDataWithOauthEntity{*studentGetOutput.StudentDataWithOauthEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentGetInput struct {
	UserId string
}

type StudentGetOutput struct {
	*constant.StudentDataWithOauthEntity
}

func (service *serviceStruct) StudentGet(in *StudentGetInput) (*StudentGetOutput, error) {
	oauthList, err := service.adminSchoolStorage.AuthOauthCaseGetByUserId(in.UserId)
	if err != nil {
		return nil, err
	}

	student, err := service.adminSchoolStorage.StudentGet(in.UserId)
	if err != nil {
		return nil, err
	}

	user, err := service.adminSchoolStorage.UserGet(in.UserId)
	if err != nil {
		return nil, err
	}

	if user.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.ImageUrl)
		if err != nil {
			return nil, err
		}
		user.ImageUrl = url
	}

	return &StudentGetOutput{
		&constant.StudentDataWithOauthEntity{
			StudentDataEntity: &constant.StudentDataEntity{
				UserEntity:    user,
				StudentEntity: student,
			},
			Oauth: oauthList,
		},
	}, nil
}
