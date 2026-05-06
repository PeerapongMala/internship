package service

import (
	"log"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type AuthCaseUpdatePasswordRequest struct {
	UserId   string `json:"user_id" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseUpdatePasswordResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

// @Id AuthCaseUpdatePassword
// @Tags Auth
// @Summary Update password
// @Description Update password
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body AuthCaseUpdatePasswordRequest true "request"
// @Success 200 {object} AuthCaseUpdatePasswordResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/password [patch]
func (api *APIStruct) AuthCaseUpdatePassword(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseUpdatePasswordRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.AuthCaseUpdatePassword(&AuthCaseUpdatePasswordInput{
		Roles:     roles,
		SubjectId: subjectId,
		UserId:    request.UserId,
		Password:  request.Password,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(
		AuthCaseUpdatePasswordResponse{
			StatusCode: http.StatusOK,
			Message:    "Password updated",
		},
	)
}

// ==================== Service ==========================

type AuthCaseUpdatePasswordInput struct {
	Roles     []int
	SubjectId string
	UserId    string
	Password  string
}

func (service *serviceStruct) AuthCaseUpdatePassword(in *AuthCaseUpdatePasswordInput) error {
	log.Println(in.SubjectId, in.UserId)
	if !slices.Contains(in.Roles, int(constant.Admin)) && (in.SubjectId != in.UserId) {
		return helper.NewHttpError(http.StatusForbidden, nil)
	}

	passwordHash, err := helper.HashAndSalt(in.Password)
	if err != nil {
		return err
	}

	err = service.authStorage.AuthCaseUpdatePassword(in.UserId, *passwordHash)
	if err != nil {
		return err
	}

	return nil
}
