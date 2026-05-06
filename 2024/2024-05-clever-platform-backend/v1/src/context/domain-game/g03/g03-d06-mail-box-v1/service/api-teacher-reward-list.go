package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api APIStruct) TeacherRewardList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	req := constant.TeacherRewardRequest{
		SubjectId: SubjectId,
		StudentId: subjectId,
	}
	response, err := api.Service.TeacherRewardList(req, pagination)
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
func (service *serviceStruct) TeacherRewardList(req constant.TeacherRewardRequest, pagination *helper.Pagination) ([]constant.TeacherRewardResponse, error) {
	response, err := service.mailBoxStorage.TeacherRewardList(req, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	for i, v := range response {
		if response[i].ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*v.ImageUrl)
			if err != nil {
				return nil, err
			}
			response[i].ImageUrl = url
		}
	}
	return response, nil
}
