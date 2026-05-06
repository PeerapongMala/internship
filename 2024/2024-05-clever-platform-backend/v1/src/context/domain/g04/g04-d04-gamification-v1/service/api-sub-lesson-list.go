package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ===========================

type SubLessonListRequest struct {
	constant.SubLessonFilter
}

// ==================== Response ==========================

type SubLessonListResponse struct {
	StatusCode int                        `json:"status_code"`
	Pagination *helper.Pagination         `json:"_pagination"`
	Data       []constant.SubLessonEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubLessonListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	subLessonListOutput, err := api.Service.SubLessonList(&SubLessonListInput{
		Pagination:           pagination,
		SubLessonListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subLessonListOutput.SubLessons,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubLessonListInput struct {
	Pagination *helper.Pagination
	*SubLessonListRequest
}

type SubLessonListOutput struct {
	SubLessons []constant.SubLessonEntity
}

func (service *serviceStruct) SubLessonList(in *SubLessonListInput) (*SubLessonListOutput, error) {
	subLessons, err := service.gamificationStorage.SubLessonList(&in.SubLessonFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SubLessonListOutput{
		subLessons,
	}, nil
}
