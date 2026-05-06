package service

import (
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type DocumentTemplateCreateRequest struct {
	SchoolID        int                   `form:"school_id" validate:"required"`
	FormatID        string                `form:"format_id" validate:"required"`
	LogoImage       *multipart.FileHeader `form:"logo_image"`
	BackgroundImage *multipart.FileHeader `form:"background_image"`
	ColourSetting   *string               `form:"colour_setting"` //json
	IsDefault       *bool                 `form:"is_default"`
	Name            *string               `form:"name"`
	SubjectId       string
}

// ==================== Response ==========================
type DocumentTemplateCreateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) DocumentTemplateCreate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &DocumentTemplateCreateRequest{}, helper.ParseOptions{Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.LogoImage, err = context.FormFile("logo_image")
	if err != nil && err != fasthttp.ErrMissingFile { //optional
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request.BackgroundImage, err = context.FormFile("background_image")
	if err != nil && err != fasthttp.ErrMissingFile { //optional
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.DocumentTemplateCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(DocumentTemplateCreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Created",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) DocumentTemplateCreate(in *DocumentTemplateCreateRequest) error {

	var logoImageKey, backgroundImageKey *string
	if in.LogoImage != nil {
		key := uuid.NewString()
		logoImageKey = &key
		err := service.cloudStorage.ObjectCreate(in.LogoImage, key, cloudStorageConstant.Image)
		if err != nil {
			return err
		}
	}

	if in.BackgroundImage != nil {
		key := uuid.NewString()
		backgroundImageKey = &key
		err := service.cloudStorage.ObjectCreate(in.BackgroundImage, key, cloudStorageConstant.Image)
		if err != nil {
			return err
		}
	}

	sqlTx, err := service.gradeSettingStorage.BeginTx()
	if err != nil {
		return err
	}

	now := time.Now().UTC()

	documentTemplate := constant.GradeDocumentTemplate{
		SchoolID:        in.SchoolID,
		FormatID:        in.FormatID,
		LogoImage:       logoImageKey,
		BackgroundImage: backgroundImageKey,
		ColourSetting:   in.ColourSetting,
		CreatedAt:       &now,
		CreatedBy:       &in.SubjectId,
		UpdatedAt:       &now,
		UpdatedBy:       &in.SubjectId,
		IsDefault:       in.IsDefault,
		Name:            in.Name,
	}

	id, err := service.gradeSettingStorage.DocumentTemplateCreate(sqlTx, &documentTemplate)
	if err != nil {
		log.Printf("insert evaluation data entry %+v", errors.WithStack(err))
		return err
	}

	if helper.Deref(in.IsDefault) {
		err = service.gradeSettingStorage.GradeDocumentDefaultUpdate(sqlTx, in.SchoolID, id)
		if err != nil {
			return err
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
