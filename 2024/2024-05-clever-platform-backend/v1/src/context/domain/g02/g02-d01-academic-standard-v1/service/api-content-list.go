package service

import (
	"fmt"
	"log"
	"net/http"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetContent(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "Curriculum Group Id should be a valid integer",
		})
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter := constant.ContentFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	req := constant.ListRequest{
		CurriculumGroupId: curriculumGroupId,
		SubjectId:         subjectId,
		Roles:             roles,
	}
	response, totalCont, err := api.Service.GetContent(req, filter, pagination)
	if err != nil {
		if err.Error() == "user not allowed" {
			return context.Status(fiber.StatusForbidden).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusForbidden,
				Message:    "User isn't content creator of this curriculum group",
			})
		}
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Error Fetching Content",
		})
	}

	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: &helper.Pagination{
			Page:          pagination.Page,
			LimitResponse: pagination.LimitResponse,
			TotalCount:    totalCont,
		},
		Data:    response,
		Message: "Data retrieved",
	})
}
func (service *serviceStruct) GetContent(r constant.ListRequest, filter constant.ContentFilter, pagination *helper.Pagination) ([]constant.ContentResponse, int, error) {
	check := false
	for _, role := range r.Roles {
		if role == int(userConstant.Admin) {
			check = true
			break
		}
	}
	if !check {
		_, err := service.repositoryStorage.CheckContentCreator(r.CurriculumGroupId, r.SubjectId)

		if err != nil {
			if err.Error() == "user not allowed" {
				return nil, 0, fmt.Errorf("user not allowed")
			}
			return nil, 0, err

		}
	}
	response, totalCount, err := service.repositoryStorage.GetContent(r.CurriculumGroupId, filter, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	return response, totalCount, nil
}
