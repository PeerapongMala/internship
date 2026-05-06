package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type SubjectListGetByCurriculumGroupIdResponse struct {
	helper.PaginationResponse
	StatusCode int                             `json:"status_code"`
	Message    string                          `json:"message"`
	Data       []constant.TeacherStudentFilter `json:"data"`
}

func (api *APIStruct) SubjectListGetByCurriculumGroupId(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	pagination := helper.PaginationDropdown(context)

	data, err := api.Service.SubjectListGetByCurriculumGroupId(curriculumGroupId, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(SubjectListGetByCurriculumGroupIdResponse{
		PaginationResponse: helper.NewPaginationResponse(pagination),
		StatusCode:         http.StatusOK,
		Message:            "Success",
		Data:               data,
	})
}

func (service *serviceStruct) SubjectListGetByCurriculumGroupId(curriculumGroupId int, pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error) {
	return service.repositoryTeacherStudent.SubjectListByCurriculumGroupId(curriculumGroupId, pagination)
}
