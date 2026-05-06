package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type LessonListRequest struct {
	SubjectId int `params:"subjectId"`
}

// ==================== Response ==========================

type LessonListResponse struct {
	StatusCode int                                   `json:"status_code"`
	Data       []constant.LessonListEntity `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonList(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &LessonListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp, err := api.Service.LessonList(&LessonListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonListResponse{
		StatusCode: http.StatusOK,
		Data:       resp.LessonLists,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LessonListInput struct {
	*LessonListRequest
}

type LessonListOutput struct {
	LessonLists []constant.LessonListEntity
}

func (service *serviceStruct) LessonList(in *LessonListInput) (*LessonListOutput, error) {

	lessonLists, err := service.teacherHomeworkStorage.GetLessonListBySubjectId(in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &LessonListOutput{
		LessonLists: lessonLists,
	}, nil
}
