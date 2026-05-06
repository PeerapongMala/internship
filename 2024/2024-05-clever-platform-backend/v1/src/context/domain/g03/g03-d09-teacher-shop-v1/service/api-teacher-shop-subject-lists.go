package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) TeacherShopSubjectLists(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	pagination := helper.PaginationNew(context)

	response, err := api.Service.TeacherShopSubjectLists(pagination, teacherId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(TeacherShopListResponse[[]constant.SubjectTeacherResponse]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
		Pagination: pagination,
	})
}

func (service *serviceStruct) TeacherShopSubjectLists(pagination *helper.Pagination, teacherId string) (r []constant.SubjectTeacherResponse, err error) {
	return service.TeacherShopStorage.TeacherShopSubjectLists(pagination, teacherId)
}
