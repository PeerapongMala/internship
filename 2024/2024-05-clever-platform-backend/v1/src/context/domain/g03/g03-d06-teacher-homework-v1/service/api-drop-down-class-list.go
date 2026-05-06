package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type ClassListRequest struct {
	SchoolId int    `query:"school_id"`
	YearId   int    `query:"year_id"`
}

// ==================== Response ==========================

type ClassListResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant.ClassListEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassList(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &ClassListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp, err := api.Service.ClassList(&ClassListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassListResponse{
		StatusCode: http.StatusOK,
		Data:       resp.ClassLists,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ClassListInput struct {
	*ClassListRequest
}

type ClassListOutput struct {
	ClassLists []constant.ClassListEntity
}

func (service *serviceStruct) ClassList(in *ClassListInput) (*ClassListOutput, error) {

	classLists, err := service.teacherHomeworkStorage.GetClassListByYearId(in.SchoolId, in.YearId)
	if err != nil {
		return nil, err
	}

	return &ClassListOutput{
		ClassLists: classLists,
	}, nil
}
