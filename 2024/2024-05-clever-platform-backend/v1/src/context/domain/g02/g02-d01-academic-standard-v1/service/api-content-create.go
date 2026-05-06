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

func (api *APIStruct) ContentCreate(context *fiber.Ctx) error {

	var body constant.ContentCreateRequest

	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusNotFound,
			Message:    "bad request",
		})
	}
	var err error
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ContentCreate(constant.ContentCreateRequest{
		LearningAreaId: body.LearningAreaId,
		Name:           body.Name,
		Status:         body.Status,
		CreatedBy:      subjectId,
		SubjectId:      subjectId,
		Roles:          roles,
	})
	if err != nil {
		if err.Error() == "learning area id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "learning area is not exist",
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
			Message:    "Cannot create content try again",
		})
	}
	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Content Created",
	})
}
func (service *serviceStruct) ContentCreate(c constant.ContentCreateRequest) error {

	curriculumGroupId, err := service.repositoryStorage.GetBylearningAreaId(c.LearningAreaId)
	if err != nil {
		if err.Error() == "learning area id is not exist" {
			return fmt.Errorf("learning area id is not exist")
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
	err = service.repositoryStorage.ContentCreate(constant.ContentCreateRequest{
		LearningAreaId: c.LearningAreaId,
		Name:           c.Name,
		Status:         c.Status,
		CreatedBy:      c.CreatedBy,
	})
	if err != nil {
		log.Print(err, 3)
		return err
	}
	return nil
}
