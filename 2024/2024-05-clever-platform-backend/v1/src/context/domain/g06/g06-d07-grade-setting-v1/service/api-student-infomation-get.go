package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentInformationGetRequest struct {
	StudentID int `params:"studentId" validate:"required"`
}

// ==================== Response ==========================

type StudentInformationGetResponse struct {
	constant.StatusResponse
	Data *constant.EvaluationStudent `json:"data"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) StudentInformationGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentInformationGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	result, err := api.Service.StudentInformationGet(request.StudentID)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentInformationGetResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: result,
	})
}

// ==================== Service ==========================

func (service *serviceStruct) StudentInformationGet(studentID int) (*constant.EvaluationStudent, error) {
	result, err := service.gradeSettingStorage.GradeEvaluationFormGetById(studentID)
	if err != nil {
		return nil, err
	}

	return result, nil
}
