package service

import (
	"log"
	"net/http"
	"time"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type AuthCaseLoginWithPinRequest struct {
	SchoolCode string `json:"school_code" validate:"required"`
	StudentId  string `json:"student_id" validate:"required"`
	Pin        string `json:"pin" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseLoginWithPinResponse struct {
	StatusCode int                `json:"status_code"`
	Data       []LoginWithPinData `json:"data"`
	Message    string             `json:"message"`
}

type LoginWithPinData struct {
	AccessToken *string `json:"access_token"`
}

// ==================== Endpoint ==========================

// @Id AuthCaseLoginWithPin
// @Tags Auth
// @Summary Login with pin
// @Description Login with pin (student)
// @Accept json
// @Produce json
// @Param request body AuthCaseLoginWithPinRequest true "request"
// @Success 200 {object} AuthCaseLoginWithPinResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/login/pin [post]
func (api *APIStruct) AuthCaseLoginWithPin(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseLoginWithPinRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	authCaseLoginWithPin, err := api.Service.AuthCaseLoginWithPin(&AuthCaseLoginWithPinInput{
		Pagination: pagination,
		SchoolCode: &request.SchoolCode,
		StudentId:  &request.StudentId,
		Pin:        &request.Pin,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseLoginWithPinResponse{
		StatusCode: http.StatusOK,
		Data: []LoginWithPinData{{
			AccessToken: authCaseLoginWithPin.AccessToken,
		}},
		Message: "Login successfully",
	})
}

// ==================== Service ==========================

type AuthCaseLoginWithPinInput struct {
	Pagination *helper.Pagination
	SchoolCode *string
	StudentId  *string
	Pin        *string
}

type AuthCaseLoginWithPinOutput struct {
	AccessToken *string
}

func (service *serviceStruct) AuthCaseLoginWithPin(in *AuthCaseLoginWithPinInput) (*AuthCaseLoginWithPinOutput, error) {
	userData, err := service.userStorage.StudentList(&constant2.StudentFilter{
		SchoolCode: *in.SchoolCode,
		StudentId:  *in.StudentId,
	}, nil)
	if err != nil {
		return nil, err
	}

	if len(userData) == 0 {
		err := helper.NewHttpError(http.StatusNotFound, nil)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if userData[0].Status != string(constant2.Enabled) {
		err := helper.NewHttpError(http.StatusUnauthorized, nil)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	pin, err := service.authStorage.AuthCaseLoginWithPin(userData[0].Id)
	if err != nil {
		return nil, err
	}

	if *pin != *in.Pin {
		err := helper.NewHttpError(http.StatusUnauthorized, nil)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	now := time.Now().UTC()
	_, err = service.userStorage.UserUpdate(nil, &constant2.UserEntity{
		Id:        userData[0].Id,
		LastLogin: &now})
	if err != nil {
		return nil, err
	}

	accessToken, err := helper.GenerateJwt(userData[0].Id)
	if err != nil {
		return nil, err
	}

	return &AuthCaseLoginWithPinOutput{
		AccessToken: accessToken,
	}, nil
}
