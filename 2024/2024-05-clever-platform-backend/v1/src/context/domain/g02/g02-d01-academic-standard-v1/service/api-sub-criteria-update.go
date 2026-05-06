package service

import (
	"fmt"
	"net/http"
	"strconv"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) SubcriteriaUpdate(context *fiber.Ctx) error {
	var body constant.SubCriteriaUpdateRequest

	SubCriteriaIdStr := context.Params("subCriteriaId")
	SubCriteriaId, err := strconv.Atoi(SubCriteriaIdStr)
	if err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "Subcriteria Id should be valid integer",
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

	err = api.Service.SubCriteriaUpdate(constant.SubCriteriaUpdateRequest{
		Id:                SubCriteriaId,
		CurriculumGroupId: body.CurriculumGroupId,
		Name:              body.Name,
		UpdatedBy:         subjectId,
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
		if err.Error() == "Subcriteria id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "Sub criteria id is not exist",
			})

		}
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Cannot Update Subcriteria",
		})
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Sub criteria Update",
	})
}
func (service *serviceStruct) SubCriteriaUpdate(c constant.SubCriteriaUpdateRequest) error {

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
	err := service.repositoryStorage.SubCriteriaUpdate(constant.SubCriteriaUpdateRequest{
		CurriculumGroupId: c.CurriculumGroupId,
		Name:              c.Name,
		UpdatedBy:         c.UpdatedBy,
		Id:                c.Id,
	})
	if err != nil {
		if err.Error() == "Subcriteria id is not exist" {
			return fmt.Errorf("Subcriteria id is not exist")
		}
		return err
	}
	return nil
}
