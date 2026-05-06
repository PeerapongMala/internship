package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type SubjectLessonListRequest struct {
	SubjectId int  `params:"subjectId" validate:"required"`
	NoDetails bool `query:"no_details"`
	constant.LessonListFilter
}

// ==================== Response ==========================

type SubjectLessonListResponse struct {
	Pagination *helper.Pagination `json:"_pagination"`
	StatusCode int                `json:"status_code"`
	Data       interface{}        `json:"data"`
	Message    string             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectLessonList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectLessonListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)
	response, err := api.Service.SubjectLessonList(&SubjectLessonListInput{
		Pagination:               pagination,
		SubjectLessonListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(SubjectLessonListResponse{
		Pagination: pagination,
		StatusCode: fiber.StatusOK,
		Data:       response.Lessons,
		Message:    "Subject sub lesson list",
	})
}

// ==================== Service ==========================
type SubjectLessonListInput struct {
	Pagination *helper.Pagination
	*SubjectLessonListRequest
}

type SubjectLessonListOutput struct {
	Lessons []constant.SubjectLessonResponse
}

func (service *serviceStruct) SubjectLessonList(in *SubjectLessonListInput) (*SubjectLessonListOutput, error) {
	lessons := []constant.SubjectLessonResponse{}

	if in.NoDetails {
		list, err := service.academicLessonStorage.SubjectLessonListNoDetails(in.Pagination, in.SubjectId, in.LessonListFilter)
		if err != nil {
			return nil, err
		}
		lessons = *list
	} else {
		list, err := service.academicLessonStorage.ListSubjectLesson(in.Pagination, in.SubjectId, in.LessonListFilter)
		if err != nil {
			return nil, err
		}
		lessons = *list
	}

	return &SubjectLessonListOutput{
		Lessons: lessons,
	}, nil
}
