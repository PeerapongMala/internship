package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherItemGetRequest struct {
	ItemId   int `params:"itemId" validate:"required"`
	SchoolId int `query:"school_id" validate:"required"`
}

type TeacherItemGetResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.ItemEntity `json:"data"`
	Message    string                `json:"message"`
}

func (api *APIStruct) TeacherItemGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherItemGetRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	teacherItemGetOutput, err := api.Service.TeacherItemGet(&TeacherItemGetInput{
		TeacherItemGetRequest: request,
		SubjectId:             subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherItemGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.ItemEntity{*teacherItemGetOutput.Item},
		Message:    "Data retrieved",
	})
}

type TeacherItemGetInput struct {
	*TeacherItemGetRequest
	SubjectId string
}

type TeacherItemGetOutput struct {
	Item *constant.ItemEntity
}

func (service serviceStruct) TeacherItemGet(in *TeacherItemGetInput) (*TeacherItemGetOutput, error) {
	isValid, err := service.teacherItemStorage.ValidateTeacher(in.SubjectId, in.SchoolId)
	if err != nil {
		return nil, err
	}
	if !isValid {
		return nil, helper.NewHttpError(http.StatusForbidden, nil)
	}

	item, err := service.teacherItemStorage.ItemGet(in.ItemId)
	if err != nil {
		return nil, err
	}

	if helper.Deref(item.SchoolId) != in.SchoolId {
		return nil, helper.NewHttpError(http.StatusForbidden, nil)
	}

	if item.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*item.ImageUrl)
		if err != nil {
			return nil, err
		}
		item.ImageUrl = url
	}

	return &TeacherItemGetOutput{
		item,
	}, nil
}
