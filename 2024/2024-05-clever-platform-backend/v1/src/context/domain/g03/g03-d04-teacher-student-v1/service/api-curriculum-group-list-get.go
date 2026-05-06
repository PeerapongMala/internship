package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type CurriculumGroupListGetResponse struct {
	helper.PaginationResponse
	StatusCode int                             `json:"status_code"`
	Message    string                          `json:"message"`
	Data       []constant.TeacherStudentFilter `json:"data"`
}

func (api *APIStruct) CurriculumGroupListGet(context *fiber.Ctx) error {
	pagination := helper.PaginationDropdown(context)

	data, err := api.Service.CurriculumGroupListGet(pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(CurriculumGroupListGetResponse{
		PaginationResponse: helper.NewPaginationResponse(pagination),
		StatusCode:         http.StatusOK,
		Message:            "Success",
		Data:               data,
	})
}

func (service *serviceStruct) CurriculumGroupListGet(pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error) {
	return service.repositoryTeacherStudent.CurriculumGroupList(pagination)
}
