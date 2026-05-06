package service

import (
	"fmt"
	"log"
	"net/http"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

func (api *APIStruct) UpdateGlobalAnnounce(context *fiber.Ctx) error {
	var body constant.UpdateGlobalAnnounceRequest
	announceId, err := context.ParamsInt("announceId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	if err = context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}
	ImageFile, err := context.FormFile("announcement_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	RolesCheck := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	body.ImageFile = ImageFile
	body.Id = announceId
	err = api.Service.UpdateGlobalAnnounce(body, RolesCheck)
	if err != nil {
		if err.Error() == "Announce id is not Exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "Announcement Id is not exist",
			})
		}
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Something went wrong try again",
		})
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Announcement Updated",
	})
}
func (service *serviceStruct) UpdateGlobalAnnounce(c constant.UpdateGlobalAnnounceRequest, Role constant.CheckRoleRequest) error {
	response, err := service.GmannounceStorage.GetGlobalAnnounceById(c.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	var key *string
	if c.ImageFile != nil {
		imageKey := uuid.NewString()
		key = &imageKey
		c.Image = key
	}

	if c.ImageFile != nil && response.ImageUrl != nil {
		err := service.cloudStorage.ObjectDelete(*response.ImageUrl)
		if err != nil {
			return nil
		}
	}
	log.Print(1)
	if key != nil {
		err := service.cloudStorage.ObjectCreate(c.ImageFile, *key, cloudStorageConstant.Image)
		if err != nil {
			return nil
		}
		for _, role := range Role.Roles {
			if role == int(userConstant.Admin) {
				c.AdminLoginAs = &Role.SubjectId
				break
			}
		}
		c.UpdatedBy = Role.SubjectId

	}
	err = service.GmannounceStorage.UpdateGlobalAnnounce(c)
	if err != nil {
		if err.Error() == "Announce id is not Exist" {
			return fmt.Errorf("Announce id is not Exist")
		}
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
