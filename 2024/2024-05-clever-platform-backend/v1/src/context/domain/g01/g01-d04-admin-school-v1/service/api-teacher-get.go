package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type TeacherGetResponse struct {
	StatusCode int              `json:"status_code"`
	Data       []TeacherGetData `json:"data"`
	Message    string           `json:"message"`
}

type TeacherGetData struct {
	*constant.TeacherEntity
	TeacherAccesses []int `json:"teacher_accesses"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherGet(context *fiber.Ctx) error {
	teacherId := context.Params("teacherId")

	teacherGetOutput, err := api.Service.TeacherGet(&TeacherGetInput{
		UserId: teacherId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherGetResponse{
		StatusCode: http.StatusOK,
		Data:       []TeacherGetData{TeacherGetData(*teacherGetOutput)},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TeacherGetInput struct {
	UserId string
}

type TeacherGetOutput struct {
	*constant.TeacherEntity
	TeacherAccesses []int
}

func (service *serviceStruct) TeacherGet(in *TeacherGetInput) (*TeacherGetOutput, error) {
	user, err := service.adminSchoolStorage.UserGet(in.UserId)
	if err != nil {
		return nil, err
	}

	oauthList, err := service.adminSchoolStorage.AuthOauthCaseGetByUserId(in.UserId)
	if err != nil {
		return nil, err
	}

	var lineUserId *string
	for _, oauth := range oauthList {
		if oauth.Provider != nil && *oauth.Provider == constant.Line {
			lineUserId = oauth.SubjectId
		}
	}

	if user.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.ImageUrl)
		if err != nil {
			return nil, err
		}
		user.ImageUrl = url
	}

	teacherAccesses, err := service.adminSchoolStorage.TeacherCaseGetTeacherAccesses(in.UserId)
	if err != nil {
		return nil, err
	}

	return &TeacherGetOutput{
		TeacherEntity: &constant.TeacherEntity{
			UserEntity: user,
			LineUserId: lineUserId,
		},
		TeacherAccesses: teacherAccesses,
	}, nil
}
