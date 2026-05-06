package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
	"log"
	"mime/multipart"
	"net/http"
	"time"
)

type TeacherItemCreateRequest struct {
	SubjectId        *int                  `params:"subjectId" validate:"required"`
	Type             *string               `form:"type" validate:"required"`
	Name             *string               `form:"name"`
	Description      *string               `form:"description"`
	Image            *multipart.FileHeader `form:"image"`
	DefaultImage     *string               `form:"default_image"`
	Status           *string               `form:"status" validate:"required"`
	TemplateItemId   *int                  `form:"template_item_id"`
	BadgeDescription *string               `form:"badge_description"`
	TemplatePath     *string               `form:"template_path"`
	AdminLoginAs     *string               `form:"admin_login_as"`
}

type TeacherItemCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

func (api *APIStruct) TeacherItemCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherItemCreateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	image, err := context.FormFile("image")
	if err != nil && err != fasthttp.ErrMissingFile {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.TeacherItemCreate(&TeacherItemCreateInput{
		TeacherItemCreateRequest: request,
		UserId:                   subjectId,
		Image:                    image,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(TeacherItemCreateResponse{
		StatusCode: http.StatusCreated,
		Message:    "Created",
	})
}

type TeacherItemCreateInput struct {
	*TeacherItemCreateRequest
	UserId string
	Image  *multipart.FileHeader
}

func (service *serviceStruct) TeacherItemCreate(in *TeacherItemCreateInput) error {
	tx, err := service.teacherItemStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var keyToAdd *string
	if in.Image != nil {
		key := uuid.NewString()
		keyToAdd = &key
	}

	if in.DefaultImage != nil {
		keyToAdd = in.DefaultImage
	}

	now := time.Now().UTC()
	itemId, err := service.teacherItemStorage.ItemCreate(tx, &constant.ItemEntity{
		TemplateItemId: in.TemplateItemId,
		Type:           in.Type,
		Name:           in.Name,
		Description:    in.Description,
		ImageUrl:       keyToAdd,
		Status:         in.Status,
		CreatedAt:      &now,
		CreatedBy:      &in.UserId,
		AdminLoginAs:   in.AdminLoginAs,
	}, *in.SubjectId, in.UserId)
	if err != nil {
		return err
	}

	if *in.Type == constant.Badge {
		err := service.teacherItemStorage.BadgeCreate(tx, &constant.BadgeEntity{
			ItemId:           itemId,
			TemplatePath:     in.TemplatePath,
			BadgeDescription: in.BadgeDescription,
		})
		if err != nil {
			return err
		}
	}

	if keyToAdd != nil && in.DefaultImage == nil {
		err := service.cloudStorage.ObjectCreate(in.Image, *keyToAdd, constant2.Image)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
