package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LevelListRequest struct {
	ClassId     int `params:"classId" validate:"required"`
	SubLessonId int `params:"subLessonId" validate:"required"`
	constant.LevelFilter
}

// ==================== Response ==========================

type LevelListResponse struct {
	StatusCode int                    `json:"status_code"`
	Pagination *helper.Pagination     `json:"_pagination"`
	Data       []constant.LevelEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LevelListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	levelListOutput, err := api.Service.LevelList(&LevelListInput{
		Pagination:       pagination,
		SubjectId:        subjectId,
		LevelListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelListOutput.Levels,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelListInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*LevelListRequest
}

type LevelListOutput struct {
	Levels []constant.LevelEntity
}

func (service *serviceStruct) LevelList(in *LevelListInput) (*LevelListOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	levels, err := service.teacherLessonStorage.LevelList(in.ClassId, in.SubLessonId, in.LevelFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &LevelListOutput{
		levels,
	}, nil
}
