package service

import (
	"database/sql"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ParentGetResponse struct {
	StatusCode int             `json:"status_code"`
	Data       []ParentGetData `json:"data"`
	Message    string          `json:"message"`
}

type ParentGetData struct {
	*constant.UserEntity
	LineUserId *string `json:"line_subject_id"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ParentGet(context *fiber.Ctx) error {
	userId := context.Params("userId")

	parentGetOutput, err := api.Service.ParentGet(&ParentGetInput{
		UserId: userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ParentGetResponse{
		StatusCode: http.StatusOK,
		Data: []ParentGetData{{
			UserEntity: parentGetOutput.UserEntity,
			LineUserId: parentGetOutput.LineUserId,
		}},
		Message: "Data retrieved",
	})
}

// ==================== Service ==========================

type ParentGetInput struct {
	UserId string
}

type ParentGetOutput struct {
	*constant.UserEntity
	LineUserId *string
}

func (service *serviceStruct) ParentGet(in *ParentGetInput) (*ParentGetOutput, error) {
	authOAuth, err := service.adminUserAccountStorage.AuthOAuthCaseGetLineByUserId(in.UserId)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	var lineUserId *string
	if authOAuth != nil {
		lineUserId = &authOAuth.SubjectId
	}

	roles, err := service.adminUserAccountStorage.UserCaseGetUserRole(in.UserId)
	if err != nil {
		return nil, err
	}
	if !slices.Contains(roles, int(constant.Parent)) {
		return nil, helper.NewHttpError(http.StatusNotFound, nil)
	}

	user, err := service.adminUserAccountStorage.UserGet(in.UserId)
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

	return &ParentGetOutput{
		UserEntity: user,
		LineUserId: lineUserId,
	}, nil
}
