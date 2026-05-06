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

type TeacherItemUpdateRequest struct {
	Id               int                   `params:"itemId" validate:"required"`
	Name             *string               `form:"name"`
	Description      *string               `form:"description"`
	Image            *multipart.FileHeader `form:"image"`
	DefaultImage     *string               `form:"default_image"`
	Status           *string               `form:"status"`
	TemplateItemId   *int                  `form:"template_item_id"`
	BadgeDescription *string               `form:"badge_description"`
	TemplatePath     *string               `form:"template_path"`
	AdminLoginAs     *string               `form:"admin_login_as"`
	SchoolId         int                   `form:"school_id"`
}

type TeacherItemUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

func (api *APIStruct) TeacherItemUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherItemUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
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

	err = api.Service.TeacherItemUpdate(&TeacherItemUpdateInput{
		TeacherItemUpdateRequest: request,
		SubjectId:                subjectId,
		Image:                    image,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherItemUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Updated",
	})
}

type TeacherItemUpdateInput struct {
	*TeacherItemUpdateRequest
	SubjectId string
	Image     *multipart.FileHeader
}

func (service *serviceStruct) TeacherItemUpdate(in *TeacherItemUpdateInput) error {
	isValid, err := service.teacherItemStorage.ValidateTeacher(in.SubjectId, in.SchoolId)
	if err != nil {
		return err
	}
	if !isValid {
		return helper.NewHttpError(http.StatusForbidden, nil)
	}

	tx, err := service.teacherItemStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	item, err := service.teacherItemStorage.ItemGet(in.Id)
	if err != nil {
		return err
	}

	var keyToAdd, keyToDelete *string
	if in.Image != nil {
		keyToDelete = item.ImageUrl
		key := uuid.NewString()
		keyToAdd = &key
	}

	if in.DefaultImage != nil {
		keyToDelete = item.ImageUrl
		keyToAdd = in.DefaultImage
	}

	now := time.Now().UTC()
	err = service.teacherItemStorage.ItemUpdate(tx, &constant.ItemEntity{
		Id:             &in.Id,
		TemplateItemId: in.TemplateItemId,
		ImageUrl:       keyToAdd,
		Name:           in.Name,
		Description:    in.Description,
		UpdatedAt:      &now,
		UpdatedBy:      &in.SubjectId,
		Status:         in.Status,
		AdminLoginAs:   in.AdminLoginAs,
	})
	if err != nil {
		return err
	}

	if *item.Type == constant.Badge {
		err := service.teacherItemStorage.BadgeUpdate(tx, &constant.BadgeEntity{
			ItemId:           &in.Id,
			TemplatePath:     in.TemplatePath,
			BadgeDescription: in.BadgeDescription,
		})
		if err != nil {
			return err
		}
	}

	err = service.teacherItemStorage.TeacherItemGroupUpdate(tx, &constant.TeacherItemGroupEntity{
		Id:           &in.Id,
		UpdatedAt:    &now,
		UpdatedBy:    &in.SubjectId,
		AdminLoginAs: in.AdminLoginAs,
	})
	if err != nil {
		return err
	}

	if keyToAdd != nil {
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

	if keyToDelete != nil {
		err := service.cloudStorage.ObjectDelete(*keyToDelete)
		if err != nil {
			return err
		}
	}

	return nil
}
