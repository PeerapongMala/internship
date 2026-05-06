package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentGetResponse struct {
	StatusCode int                          `json:"status_code"`
	Data       []constant.StudentDataEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

// @Id StudentGet
// @Tags Users
// @Summary Get Student
// @Description Get Student
// @Security BearerAuth
// @Produce json
// @Param userId path string true "userId"
// @Success 200 {object} StudentGetResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /users/v1/student/{userId} [get]
func (api *APIStruct) StudentGet(context *fiber.Ctx) error {
	userId := context.Params("userId")
	studentData, err := api.Service.StudentGet(userId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.StudentDataEntity{*studentData},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) StudentGet(userId string) (*constant.StudentDataEntity, error) {
	studentData, err := service.adminUserAccountStorage.StudentGet(userId)
	if err != nil {
		return nil, err
	}

	return studentData, nil
}
