package service

import (
	"fmt"
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

type SchoolUpdateRequest struct {
	constant.SchoolUpdateRequest
	SchoolImage *multipart.FileHeader `form:"school_profile"`
}

func (api *APIStruct) SchoolUpdate(context *fiber.Ctx) error {
	schoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	request, err := helper.ParseAndValidateRequest(context, &SchoolUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))

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
	request.Id = schoolId
	request.UpdatedBy = subjectId
	err = api.Service.SchoolUpdate(request)
	if err != nil {
		if err.Error() == "school id is not exist" {
			msg := "School Id is not exist"
			return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusNotFound, &msg))
		}
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "school update",
	})
}
func (service *serviceStruct) SchoolUpdate(c *SchoolUpdateRequest) error {
	response, err := service.adminSchoolStorage.GetSchoolById(c.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	var key *string
	if c.SchoolImage != nil {
		imageKey := uuid.NewString()
		key = &imageKey

	}

	if c.SchoolImage != nil && response.ImageUrl != nil {
		err := service.cloudStorage.ObjectDelete(*response.ImageUrl)
		if err != nil {
			return nil
		}
	}

	if key != nil {
		err := service.cloudStorage.ObjectCreate(c.SchoolImage, *key, cloudStorageConstant.Image)
		if err != nil {
			return nil
		}
	}
	c.ImageUrl = key
	err = service.adminSchoolStorage.SchoolUpdate(c.SchoolUpdateRequest)
	if err != nil {
		if err.Error() == "school id is not exist" {
			return fmt.Errorf("school id is not exist")
		}
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil

}
