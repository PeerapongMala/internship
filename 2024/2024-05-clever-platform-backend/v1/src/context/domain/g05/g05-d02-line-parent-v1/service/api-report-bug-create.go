package service

import (
	"log"
	"net/http"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/google/uuid"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================
func (api *APIStruct) CreateReportBug(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.Bug{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.CreatedBy = subjectId

	form, err := context.MultipartForm()
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	images := form.File["images"]
	request.Images = images

	err = api.Service.CreateReportBug(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) CreateReportBug(bug *constant.Bug) error {
	tx, err := service.lineParentStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	id, err := service.lineParentStorage.CreateReportBug(tx, bug)
	if err != nil {
		return err
	}

	keys := []string{}
	for _, image := range bug.Images {
		key := uuid.NewString()
		err = service.cloudStorage.ObjectCreate(image, key, constant2.Image)
		if err != nil {
			return err
		}
		keys = append(keys, key)
	}
	log.Println("Keys: ", keys)
	err = service.lineParentStorage.ReportBugImageCreate(tx, *id, keys)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
