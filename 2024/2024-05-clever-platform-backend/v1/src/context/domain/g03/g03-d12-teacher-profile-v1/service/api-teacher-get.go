package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type TeacherGetResponse struct {
	StatusCode int `json:"status_code"`
	Data       []constant.TeacherEntity
	Message    string `json:"message"`
}

func (api *APIStruct) TeacherGet(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	teacherGetOutput, err := api.Service.TeacherGet(&TeacherGetInput{
		TeacherId: subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.TeacherEntity{*teacherGetOutput.TeacherEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TeacherGetInput struct {
	TeacherId string
}

type TeacherGetOutput struct {
	*constant.TeacherEntity
}

func (service *serviceStruct) TeacherGet(in *TeacherGetInput) (*TeacherGetOutput, error) {
	teacher, err := service.teacherProfileStorage.UserGet(in.TeacherId)
	if err != nil {
		return nil, err
	}

	oauthList, err := service.teacherProfileStorage.AuthOauthCaseGetByUserId(in.TeacherId)
	if err != nil {
		return nil, err
	}

	var lineUserId *string
	for _, oauth := range oauthList {
		if oauth.Provider != nil && *oauth.Provider == constant.Line {
			lineUserId = oauth.SubjectId
		}
	}

	if teacher.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*teacher.ImageUrl)
		if err != nil {
			return nil, err
		}
		teacher.ImageUrl = url
	}

	return &TeacherGetOutput{
		&constant.TeacherEntity{
			UserEntity: *teacher,
			LineUserId: lineUserId,
		},
	}, nil
}
