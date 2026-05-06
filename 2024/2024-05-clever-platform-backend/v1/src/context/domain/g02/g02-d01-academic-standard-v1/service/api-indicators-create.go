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

func (api *APIStruct) IndicatorsCreate(context *fiber.Ctx) error {
	var body constant.IndicatorsCreateRequest
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
	body.CreatedBy = subjectId
	body.SubjectId = subjectId
	body.Roles = roles
	err := api.Service.IndicatorsCreate(body)
	if err != nil {
		if err.Error() == "learning content id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "Learning content id is not exist",
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
			Message:    "Cannot Create indicators",
		})
	}
	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Indicators Created",
	})
}

func (service *serviceStruct) IndicatorsCreate(c constant.IndicatorsCreateRequest) error {
	curriculumGroupId, err := service.repositoryStorage.GetByLearningContentId(c.LearningContentId)
	if err != nil {
		if err.Error() == "learning content id is not exist" {
			return fmt.Errorf("learning content id is not exist")
		}
		log.Printf("%+v", errors.WithStack(err))
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
	err = service.repositoryStorage.IndicatorsCreate(constant.IndicatorsCreateRequest{
		LearningContentId: c.LearningContentId,
		Name:              c.Name,
		ShortName:         c.ShortName,
		TranscriptName:    c.TranscriptName,
		Status:            c.Status,
		CreatedBy:         c.CreatedBy,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil

}
