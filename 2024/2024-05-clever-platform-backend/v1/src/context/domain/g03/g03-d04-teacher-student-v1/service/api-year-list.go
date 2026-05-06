package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type YearListResponse struct {
	Pagination *helper.Pagination `json:"_pagination"`
	StatusCode int                `json:"status_code"`
	Message    string             `json:"message"`
	Data       []string           `json:"data"`
}

func (api APIStruct) YearList(context *fiber.Ctx) error {
	subjectId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationNew(context)
	yearListOutput, err := api.Service.YearList(&YearListInput{
		SubjectId:  subjectId,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(YearListResponse{
		Pagination: pagination,
		StatusCode: http.StatusOK,
		Message:    "Data retrieved",
		Data:       yearListOutput.Years,
	})
}

type YearListInput struct {
	SubjectId  string
	Pagination *helper.Pagination
}

type YearListOutput struct {
	Years []string
}

func (service *serviceStruct) YearList(in *YearListInput) (*YearListOutput, error) {
	years, err := service.repositoryTeacherStudent.YearList(in.Pagination, in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &YearListOutput{
		Years: years,
	}, nil
}
