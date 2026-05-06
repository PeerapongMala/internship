package service

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetTopic(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	SubCriteriaIdStr := context.Params("subCriteriaId")
	SubCriteriaId, err := strconv.Atoi(SubCriteriaIdStr)
	if err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "SubCriteria should be a valid integer",
		})
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		// log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {

		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter := constant.TopicsFilter{}
	req := constant.ListRequest{
		SubjectId: subjectId,
		Roles:     roles,
	}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	response, totalCount, err := api.Service.GetTopic(SubCriteriaId, req, filter, pagination)
	if err != nil {
		if err.Error() == "sub criteria id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "Sub criteria id is not exist",
			})
		}
		if err.Error() == "user not allowed" {
			return context.Status(fiber.StatusForbidden).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusForbidden,
				Message:    "User isn't content creator of this curriculum group",
			})
		}
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Error Fetching topic",
		})
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
func (service *serviceStruct) GetTopic(SubcriteriaId int, r constant.ListRequest, filter constant.TopicsFilter, pagination *helper.Pagination) ([]constant.TopicResponse, int, error) {
	curriculumGroupId, err := service.repositoryStorage.GetBySubCriteriaId(SubcriteriaId)
	if err != nil {
		if err.Error() == "sub criteria id is not exist" {
			return nil, 0, fmt.Errorf("sub criteria id is not exist")
		}
		return nil, 0, err
	}
	check := false
	for _, role := range r.Roles {
		if role == int(userConstant.Admin) {
			check = true
			break
		}
	}
	if !check {
		_, err := service.repositoryStorage.CheckContentCreator(curriculumGroupId, r.SubjectId)

		if err != nil {
			if err.Error() == "user not allowed" {
				return nil, 0, fmt.Errorf("user not allowed")
			}
			return nil, 0, err

		}
	}
	response, totalCount, err := service.repositoryStorage.GetTopic(SubcriteriaId, filter, pagination)
	if err != nil {
		return nil, 0, err
	}
	return response, totalCount, nil
}
