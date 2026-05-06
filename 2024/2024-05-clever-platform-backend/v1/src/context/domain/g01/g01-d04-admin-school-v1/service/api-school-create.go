package service

import (
	"log"
	"mime/multipart"
	"net/http"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

type SchoolCreateRequest struct {
	constant.SchoolCreateRequest
	SchoolImage *multipart.FileHeader `form:"school_profile"`
}

func (api *APIStruct) SchoolCreate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &SchoolCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	SchoolImageFile, err := context.FormFile("school_profile")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.SchoolImage = SchoolImageFile
	request.CreatedBy = subjectId
	err = api.Service.SchoolCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "school created",
	})
}
func (service *serviceStruct) SchoolCreate(c *SchoolCreateRequest) error {
	var key *string
	if c.SchoolImage != nil {
		imageKey := uuid.NewString()
		key = &imageKey

	}

	if c.SchoolImage != nil {
		err := service.cloudStorage.ObjectCreate(c.SchoolImage, *key, cloudStorageConstant.Image)
		if err != nil {
			return err
		}
	}
	c.ImageUrl = key
	err := service.adminSchoolStorage.SchoolCreate(c.SchoolCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
