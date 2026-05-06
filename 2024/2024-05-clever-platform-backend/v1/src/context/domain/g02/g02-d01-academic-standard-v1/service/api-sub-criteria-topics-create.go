package service

import (
	"fmt"
	"net/http"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) SubCriteriaTopicCreate(context *fiber.Ctx) error {
	var body constant.SubCriteriaTopicsCreateRequest

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
	body.SubjectId = subjectId
	err := api.Service.SubCriteriaTopicCreate(body)
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
			Message:    "Cannot create sub criteria topics",
		})
	}
	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Subcriteria topics Created",
	})
}
func (service *serviceStruct) SubCriteriaTopicCreate(c constant.SubCriteriaTopicsCreateRequest) error {
	curriculumGroupId, err := service.repositoryStorage.GetBySubCriteriaId(c.SubCriteriaId)
	if err != nil {
		if err.Error() == "sub criteria id is not exist" {
			return fmt.Errorf("sub criteria id is not exist")
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
	err = service.repositoryStorage.SubCriteriaTopicCreate(constant.SubCriteriaTopicsCreateRequest{

		IndicatorId:   c.IndicatorId,
		Name:          c.Name,
		ShortName:     c.ShortName,
		Status:        c.Status,
		CreatedBy:     c.CreatedBy,
		SubCriteriaId: c.SubCriteriaId,
		YearId:        c.YearId,
	})
	if err != nil {
		return err
	}
	return nil
}
