package service

import (
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

func (api *APIStruct) AddGlobalAnnounce(context *fiber.Ctx) error {
	var body constant.CreateGlobalAnnounceRequest

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
	RolesCheck := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	ImageFile, err := context.FormFile("announcement_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	body.ImageFile = ImageFile
	err = api.Service.AddGlobalAnnounce(body, RolesCheck)
	if err != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Something went wrong try again",
		})
	}
	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Announcement Created",
	})
}
func (service *serviceStruct) AddGlobalAnnounce(c constant.CreateGlobalAnnounceRequest, Role constant.CheckRoleRequest) error {
	var key *string
	if c.ImageFile != nil {
		imageKey := uuid.NewString()
		key = &imageKey
		c.Image = key
	}

	if c.ImageFile != nil {
		err := service.cloudStorage.ObjectCreate(c.ImageFile, *key, cloudStorageConstant.Image)
		if err != nil {
			return err
		}
	}
	for _, role := range Role.Roles {
		if role == int(userConstant.Admin) {
			c.AdminLoginAs = &Role.SubjectId
			break
		}
	}
	c.CreatedBy = Role.SubjectId
	_, err := service.GmannounceStorage.AddGlobalAnnounce(c)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err

	}
	return nil
}
