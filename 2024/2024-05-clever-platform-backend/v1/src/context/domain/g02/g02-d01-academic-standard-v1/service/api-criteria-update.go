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

func (api *APIStruct) CriteriaUpdate(context *fiber.Ctx) error {
	var body constant.CriteriaUpdateRequest

	CriteriaIdStr := context.Params("criteriaId")
	CriteriaId, err := strconv.Atoi(CriteriaIdStr)
	if err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "CriteriaId should be a valid intger",
		})
	}
	body.Id = CriteriaId
	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
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
	body.Roles = roles
	body.UpdatedBy = subjectId
	body.SubjectId = subjectId
	err = api.Service.CriteriaUpdate(body)
	if err != nil {
		if err.Error() == "content id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "Criteria id is not exist",
			})
		}
		if err.Error() == "user not allowed" {
			return context.Status(fiber.StatusForbidden).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusForbidden,
				Message:    "User isn't content creator of this curriculum group",
			})
		}
		if err.Error() == "Criteria Id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "Criteria Id is not exist",
			})
		}
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Cannot Update Criteria",
		})
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Criteria Updated",
	})
}

func (service *serviceStruct) CriteriaUpdate(c constant.CriteriaUpdateRequest) error {
	curriculumGroupId, err := service.repositoryStorage.GetByContentId(c.ContentId)
	if err != nil {
		if err.Error() == "content id is not exist" {
			return fmt.Errorf("content id is not exist")
		}
		return err

	}
	check := false
	for _, role := range c.Roles {
		if role == int(userConstant.Admin) {
			check = true
			break
		}
	}
	if !check {
		_, err := service.repositoryStorage.CheckContentCreator(curriculumGroupId, c.SubjectId)

		if err != nil {
			if err.Error() == "user not allowed" {
				return fmt.Errorf("user not allowed")
			}
			return err

		}
	}
	service.repositoryStorage.CheckContentCreator(curriculumGroupId, c.SubjectId)
	err = service.repositoryStorage.CriteriaUpdate(constant.CriteriaUpdateRequest{
		Id:        c.Id,
		ContentId: c.ContentId,
		Name:      c.Name,
		ShortName: c.ShortName,
		Status:    c.Status,
		UpdatedBy: c.UpdatedBy,
	})
	if err != nil {
		if err.Error() == "Criteria Id is not exist" {
			return fmt.Errorf("Criteria Id is not exist")
		}
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil

}
