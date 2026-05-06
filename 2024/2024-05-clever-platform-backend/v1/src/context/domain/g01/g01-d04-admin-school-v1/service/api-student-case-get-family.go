package service

import (
	"database/sql"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentCaseGetFamilyResponse struct {
	StatusCode int                     `json:"status_code"`
	Data       []constant.FamilyEntity `json:"data"`
	Message    string                  `json:"message"`
}

func (api *APIStruct) StudentCaseGetFamily(context *fiber.Ctx) error {
	userId := context.Params("userId")

	studentCaseGetFamilyOutput, err := api.Service.StudentCaseGetFamily(&StudentCaseGetFamilyInput{
		UserId: userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	family := []constant.FamilyEntity{}
	if studentCaseGetFamilyOutput.FamilyEntity != nil {
		family = append(family, *studentCaseGetFamilyOutput.FamilyEntity)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseGetFamilyResponse{
		StatusCode: http.StatusOK,
		Data:       family,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseGetFamilyInput struct {
	UserId string
}

type StudentCaseGetFamilyOutput struct {
	*constant.FamilyEntity
}

func (service *serviceStruct) StudentCaseGetFamily(in *StudentCaseGetFamilyInput) (*StudentCaseGetFamilyOutput, error) {
	family, err := service.adminSchoolStorage.StudentCaseGetFamily(in.UserId)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return &StudentCaseGetFamilyOutput{
		family,
	}, nil
}
