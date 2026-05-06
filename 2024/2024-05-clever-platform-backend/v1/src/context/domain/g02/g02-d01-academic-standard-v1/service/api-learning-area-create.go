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

func (api *APIStruct) LearningAreaCreate(context *fiber.Ctx) error {
	var body constant.LearningAreaCreateRequest

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
	body.CreatedBy = subjectId

	err := api.Service.LearningAreaCreate(constant.LearningAreaCreateRequest{
		CurriculumGroupId: body.CurriculumGroupId,
		YearId:            body.YearId,
		LearningAreaName:  body.LearningAreaName,
		Status:            body.Status,
		CreatedBy:         body.CreatedBy,
		SubjectId:         subjectId,
		Roles:             roles,
	})
	if err != nil {
		if err.Error() == "user not allowed" {
			return context.Status(fiber.StatusForbidden).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusForbidden,
				Message:    "User isn't content creator of this curriculum group",
			})
		}

		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Something went wrong, please try again later",
		})
	}

	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Learning Area Created",
	})
}
func (service *serviceStruct) LearningAreaCreate(c constant.LearningAreaCreateRequest) error {
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
	err := service.repositoryStorage.LearningAreaCreate(constant.LearningAreaCreateRequest{
		CurriculumGroupId: c.CurriculumGroupId,
		YearId:            c.YearId,
		LearningAreaName:  c.LearningAreaName,
		Status:            c.Status,
		CreatedBy:         c.CreatedBy,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
