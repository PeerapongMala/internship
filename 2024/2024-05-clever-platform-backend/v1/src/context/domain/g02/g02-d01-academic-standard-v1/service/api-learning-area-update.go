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

func (api *APIStruct) LearningAreaUpdate(context *fiber.Ctx) error {
	var body constant.LearningAreaUpdateRequest

	learningAreaIdStr := context.Params("learningAreaId")

	learningAreaId, err := strconv.Atoi(learningAreaIdStr)
	if err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "learningAreaId should be a valid integer",
		})
	}

	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
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
	body.Roles = roles
	body.Id = learningAreaId
	body.UpdatedBy = subjectId
	body.SubjectId = subjectId
	err = api.Service.LearningAreaUpdate(body)
	if err != nil {
		if err.Error() == "Id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "Learning Area Id does not exist",
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
			Message:    "Cannot update Learning Area",
		})
	}

	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Learning Area Updated",
	})
}

func (service *serviceStruct) LearningAreaUpdate(c constant.LearningAreaUpdateRequest) error {

	check := false
	for _, role := range c.Roles {
		if role == int(userConstant.Admin) {
			check = true
			break
		}
	}
	if !check {
		_, err := service.repositoryStorage.CheckContentCreator(c.CurriculumGroupId, c.SubjectId)

		if err != nil {
			if err.Error() == "user not allowed" {
				return fmt.Errorf("user not allowed")
			}
			return err

		}
	}
	err := service.repositoryStorage.LearningAreaUpdate(constant.LearningAreaUpdateRequest{
		Id:                c.Id,
		CurriculumGroupId: c.CurriculumGroupId,
		YearId:            c.YearId,
		LearningAreaName:  c.LearningAreaName,
		Status:            c.Status,
		UpdatedBy:         c.UpdatedBy,
	})
	if err != nil {
		if err.Error() == "Id is not exist" {
			return fmt.Errorf("Id is not exist")
		}
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
