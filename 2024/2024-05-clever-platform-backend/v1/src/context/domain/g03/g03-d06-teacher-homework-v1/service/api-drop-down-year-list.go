package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type YearListRequest struct {
	YearName string `params:"yearName"`
}

// ==================== Response ==========================

type YearListResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant.YearListEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) YearList(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &YearListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp, err := api.Service.YearList(&YearListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(YearListResponse{
		StatusCode: http.StatusOK,
		Data:       resp.YearLists,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type YearListInput struct {
	*YearListRequest
}

type YearListOutput struct {
	YearLists []constant.YearListEntity
}

func (service *serviceStruct) YearList(in *YearListInput) (*YearListOutput, error) {

	yearLists, err := service.teacherHomeworkStorage.GetYearList()
	if err != nil {
		return nil, err
	}

	return &YearListOutput{
		YearLists: yearLists,
	}, nil
}
