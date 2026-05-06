package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherItemGroupListRequest struct {
	constant.TeacherItemGroupFilter
}
type TeacherItemGroupListResponse struct {
	StatusCode int                               `json:"status_code"`
	Pagination *helper.Pagination                `json:"_pagination"`
	Data       []constant.TeacherItemGroupEntity `json:"data"`
	Message    string                            `json:"message"`
}

func (api *APIStruct) TeacherItemGroupList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &TeacherItemGroupListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	teacherItemGroupListOutput, err := api.Service.TeacherItemGroupList(&TeacherItemGroupListInput{
		TeacherItemGroupListRequest: request,
		Pagination:                  pagination,
		SubjectId:                   subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherItemGroupListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       teacherItemGroupListOutput.TeacherItemGroups,
		Message:    "Data retrieved",
	})
}

type TeacherItemGroupListInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*TeacherItemGroupListRequest
}

type TeacherItemGroupListOutput struct {
	TeacherItemGroups []constant.TeacherItemGroupEntity
}

func (service *serviceStruct) TeacherItemGroupList(in *TeacherItemGroupListInput) (*TeacherItemGroupListOutput, error) {
	teacherItemGroups, err := service.teacherItemStorage.TeacherItemGroupList(in.Pagination, in.SubjectId, &in.TeacherItemGroupFilter)
	if err != nil {
		return nil, err
	}

	return &TeacherItemGroupListOutput{
		teacherItemGroups,
	}, nil
}
