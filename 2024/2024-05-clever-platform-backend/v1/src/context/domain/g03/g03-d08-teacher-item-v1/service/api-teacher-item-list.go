package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherItemListRequest struct {
	constant.TeacherItemFilter
}

type TeacherItemListResponse struct {
	StatusCode int                   `json:"status_code"`
	Pagination *helper.Pagination    `json:"_pagination"`
	Data       []constant.ItemEntity `json:"data"`
	Message    string                `json:"message"`
}

func (api *APIStruct) TeacherItemList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request, err := helper.ParseAndValidateRequest(context, &TeacherItemListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.TeacherItemFilter.TeacherId = subjectId

	teacherItemListOutput, err := api.Service.TeacherItemList(&TeacherItemListInput{
		Pagination:             pagination,
		TeacherItemListRequest: request,
		SubjectId:              subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherItemListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       teacherItemListOutput.Items,
		Message:    "Data retrieved",
	})
}

type TeacherItemListInput struct {
	Pagination *helper.Pagination
	*TeacherItemListRequest
	SubjectId string
}
type TeacherItemListOutput struct {
	Items []constant.ItemEntity
}

func (service *serviceStruct) TeacherItemList(in *TeacherItemListInput) (*TeacherItemListOutput, error) {
	items, err := service.teacherItemStorage.TeacherItemList(in.Pagination, in.TeacherItemFilter, in.SubjectId)
	if err != nil {
		return nil, err
	}

	for i, item := range items {
		if item.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*item.ImageUrl)
			if err != nil {
				return nil, err
			}
			items[i].ImageUrl = url
		}
		if item.TemplateImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*item.TemplateImageUrl)
			if err != nil {
				return nil, err
			}
			items[i].TemplateImageUrl = url
		}
	}

	return &TeacherItemListOutput{
		items,
	}, nil
}
