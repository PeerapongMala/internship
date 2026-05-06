package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type StudyGroupListRequest struct {
	ClassId   int `params:"classId" validate:"required"`
	SubjectId int `params:"subjectId" validate:"required"`
	constant.StudyGroupFilter
}

// ==================== Response ==========================

type StudyGroupListResponse struct {
	StatusCode int                         `json:"status_code"`
	Pagination *helper.Pagination          `json:"_pagination"`
	Data       []constant.StudyGroupEntity `json:"data"`
	Message    string                      `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudyGroupList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &StudyGroupListRequest{}, helper.ParseOptions{
		Params: true,
		Query:  true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studyGroupListOutput, err := api.Service.StudyGroupList(&StudyGroupListInput{
		Pagination:            pagination,
		UserId:                subjectId,
		StudyGroupListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudyGroupListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       studyGroupListOutput.StudyGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudyGroupListInput struct {
	Pagination *helper.Pagination
	UserId     string
	*StudyGroupListRequest
}

type StudyGroupListOutput struct {
	StudyGroups []constant.StudyGroupEntity
}

func (service *serviceStruct) StudyGroupList(in *StudyGroupListInput) (*StudyGroupListOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.UserId,
	})
	if err != nil {
		return nil, err
	}

	studyGroups, err := service.teacherLessonStorage.StudyGroupList(in.ClassId, in.SubjectId, in.StudyGroupFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &StudyGroupListOutput{studyGroups}, nil
}
