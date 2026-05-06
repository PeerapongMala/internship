package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) AcademicYearDropDown(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	response, err := api.Service.AcademicYearList(subjectId, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: pagination,
		Data:       response,
		Message:    "data received",
	})
}
func (service *serviceStruct) AcademicYearList(teacherId string, pagination *helper.Pagination) ([]constant.AcademicYear, error) {
	//schoolId, err := service.teacherRewardStorage.GetSchoolIdByTeacherId(teacherId)
	//if err != nil {
	//	log.Printf("%+v", errors.WithStack(err))
	//	return nil, err
	//}
	response, err := service.teacherRewardStorage.AcademicYearList(teacherId, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return response, nil
}
