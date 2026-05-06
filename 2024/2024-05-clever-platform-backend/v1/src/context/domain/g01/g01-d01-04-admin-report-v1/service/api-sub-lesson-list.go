package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

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

func (api *APIStruct) SubLessonList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &SubLessonListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

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
	subLessons, err := service.adminReportStorage.SubLessonList(in.Pagination, &constant.SubLessonFilter{
		UserId:      in.UserId,
		LessonId:    in.LessonId,
		SubLessonId: in.SubLessonId,
	})
	if err != nil {
		return nil, err
	}

	return &SubLessonListOutput{
		subLessons,
	}, nil
}
