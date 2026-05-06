package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentInformationUpdateRequest struct {
	constant.EvaluationStudent
	StudentID int `params:"studentId" validate:"required"`
}

// ==================== Response ==========================

type StudentInformationUpdateResponse struct {
	constant.StatusResponse
	Data *constant.EvaluationStudent `json:"data"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) StudentInformationUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentInformationUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.ID = request.StudentID
	err = api.Service.StudentInformationUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	result, err := api.Service.StudentInformationGet(request.StudentID)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(StudentInformationUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: result,
	})
}

// ==================== Service ==========================

func (service *serviceStruct) StudentInformationUpdate(in *StudentInformationUpdateRequest) error {
	err := service.gradeSettingStorage.GradeEvaluationStudentUpdate(in.EvaluationStudent)
	if err != nil {
		return err
	}

	return nil
}
