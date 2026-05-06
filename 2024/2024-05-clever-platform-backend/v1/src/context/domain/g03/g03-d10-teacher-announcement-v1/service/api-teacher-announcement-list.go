package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) AnnouncementList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant.TeacherAnnounceFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	RolesCheck := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	response, totalCount, err := api.Service.AnnouncementList(pagination, filter, RolesCheck)
	if err != nil {

		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: &helper.Pagination{
			Page:          pagination.Page,
			LimitResponse: pagination.LimitResponse,
			TotalCount:    totalCount,
		},

		Data:    response,
		Message: "Data retrieved",
	})
}
func (service *serviceStruct) AnnouncementList(pagination *helper.Pagination, filter constant.TeacherAnnounceFilter, Role constant.CheckRoleRequest) ([]constant.TeacherAnnounceResponse, int, error) {
	schoolId, err := service.TeacherannounceStorage.GetSchoolByUserId(Role.SubjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	response, totalCount, err := service.TeacherannounceStorage.AnnouncementList(pagination, schoolId, filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	return response, totalCount, nil
}
