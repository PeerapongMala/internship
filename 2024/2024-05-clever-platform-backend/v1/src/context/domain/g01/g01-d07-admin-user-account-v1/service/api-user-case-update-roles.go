package service

import (
	"log"
	"net/http"
	"slices"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type UserCaseUpdateRolesRequest struct {
	Roles []int `json:"roles" validate:"required"`
}

// ==================== Response ==========================

type UserCaseUpdateRolesResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

// @Id UserCaseUpdateRoles
// @Tags Users
// @Summary Update admin roles
// @Description Update admin roles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param userId path string true "userId"
// @Param request body UserCaseUpdateRolesRequest true "request"
// @Success 200 {object} UserCaseUpdateRolesResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /users/v1/user/{userId}/roles [patch]
func (api *APIStruct) UserCaseUpdateRoles(context *fiber.Ctx) error {
	userId := context.Params("userId")
	request, err := helper.ParseAndValidateRequest(context, &UserCaseUpdateRolesRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	for _, role := range request.Roles {
		if !slices.Contains(constant.RoleList, constant.Role(role)) {
			msg := "Invalid roles"
			err := helper.NewHttpError(http.StatusBadRequest, &msg)
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	userCaseUpdateRolesOutput, err := api.Service.UserCaseUpdateRoles(&UserCaseUpdateRolesInput{
		UserId:                     userId,
		UserCaseUpdateRolesRequest: request,
		SubjectId:                  subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&UserCaseUpdateRolesResponse{
		StatusCode: http.StatusOK,
		Data:       userCaseUpdateRolesOutput.Roles,
		Message:    "User updated",
	})
}

// ==================== Service ==========================

type UserCaseUpdateRolesInput struct {
	UserId string
	*UserCaseUpdateRolesRequest
	SubjectId string
}

type UserCaseUpdateRolesOutput struct {
	Roles []int
}

func (service *serviceStruct) UserCaseUpdateRoles(in *UserCaseUpdateRolesInput) (*UserCaseUpdateRolesOutput, error) {
	now := time.Now().UTC()
	userEntity := constant.UserEntity{
		Id:        in.UserId,
		UpdatedAt: &now,
		UpdatedBy: &in.SubjectId,
	}

	tx, err := service.adminUserAccountStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	userRoles, err := service.adminUserAccountStorage.UserCaseGetUserRole(in.UserId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if !slices.Contains(userRoles, int(constant.Admin)) {
		msg := "User isn't admin"
		err := helper.NewHttpError(http.StatusConflict, &msg)
		return nil, err
	}

	_, err = service.adminUserAccountStorage.UserUpdate(tx, &userEntity)
	if err != nil {
		return nil, err
	}

	err = service.adminUserAccountStorage.UserCaseUpdateUserRole(tx, in.UserId, in.Roles)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	userRoles, err = service.adminUserAccountStorage.UserCaseGetUserRole(in.UserId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &UserCaseUpdateRolesOutput{
		Roles: userRoles,
	}, nil
}
