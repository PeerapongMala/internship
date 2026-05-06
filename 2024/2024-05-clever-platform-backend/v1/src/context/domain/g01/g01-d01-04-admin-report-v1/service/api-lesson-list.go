package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LessonListRequest struct {
	constant.LessonFilter
}

// ==================== Response ==========================

type LessonListResponse struct {
	StatusCode int                     `json:"status_code"`
	Pagination *helper.Pagination      `json:"_pagination"`
	Data       []constant.LessonEntity `json:"data"`
	Message    string                  `json:"message"`
}

func (api *APIStruct) LessonList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &LessonListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	lessonListOutput, err := api.Service.LessonList(&LessonListInput{
		Pagination:        pagination,
		LessonListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       lessonListOutput.Lessons,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LessonListInput struct {
	Pagination *helper.Pagination
	*LessonListRequest
}

type LessonListOutput struct {
	Lessons []constant.LessonEntity
}

func (service *serviceStruct) LessonList(in *LessonListInput) (*LessonListOutput, error) {
	lessons, err := service.adminReportStorage.LessonList(in.Pagination, &constant.LessonFilter{
		UserId:            in.UserId,
		CurriculumGroupId: in.CurriculumGroupId,
		SubjectId:         in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	return &LessonListOutput{lessons}, nil
}
