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
type DocumentTemplateUpdateRequest struct {
	Id                    int                   `params:"id" validate:"required"`
	SchoolID              int                   `form:"school_id" validate:"required"`
	FormatID              string                `form:"format_id" validate:"required"`
	Name                  string                `form:"name"`
	LogoImage             *multipart.FileHeader `form:"logo_image"`
	BackgroundImage       *multipart.FileHeader `form:"background_image"`
	ColourSetting         *string               `form:"colour_setting"` //json
	IsDefault             *bool                 `form:"is_default"`
	DeleteLogoImage       bool                  `form:"delete_logo_image"`
	DeleteBackgroundImage bool                  `form:"delete_background_image"`
	SubjectId             string
}

// ==================== Response ==========================
type DocumentTemplateUpdateResponse struct {
	constant.StatusResponse
	Data *DocumentTemplateUpdateData `json:"data"`
}

type DocumentTemplateUpdateData struct {
}

// ==================== Endpoint ==========================

func (api *APIStruct) DocumentTemplateUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &DocumentTemplateUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
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
	responseData, err := api.Service.DocumentTemplateUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(DocumentTemplateUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
			Data:       responseData,
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) DocumentTemplateUpdate(in *DocumentTemplateUpdateRequest) (*DocumentTemplateUpdateData, error) {
	current, err := service.gradeSettingStorage.DocumentTemplateGet(in.Id)
	if err != nil {
		return nil, err
	}

	var logoImageKey, backgroundImageKey *string
	if in.LogoImage != nil {
		key := uuid.NewString()
		logoImageKey = &key
		err := service.cloudStorage.ObjectCreate(in.LogoImage, key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}

		err = service.cloudStorage.ObjectDelete(helper.Deref(current.LogoImage))
		if err != nil {
			return nil, err
		}
	}

	if in.BackgroundImage != nil {
		key := uuid.NewString()
		backgroundImageKey = &key
		err := service.cloudStorage.ObjectCreate(in.BackgroundImage, key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}

		err = service.cloudStorage.ObjectDelete(helper.Deref(current.BackgroundImage))
		if err != nil {
			return nil, err
		}
	}

	sqlTx, err := service.gradeSettingStorage.BeginTx()
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()

	documentTemplate := constant.GradeDocumentTemplate{
		Id:              &in.Id,
		Name:            &in.Name,
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
	}

	id, err := service.gradeSettingStorage.DocumentTemplateUpsert(sqlTx, &documentTemplate)
	if err != nil {
		log.Printf("insert evaluation data entry %+v", errors.WithStack(err))
		return nil, err
	}

	if helper.Deref(in.IsDefault) {
		err = service.gradeSettingStorage.GradeDocumentDefaultUpdate(sqlTx, in.SchoolID, id)
		if err != nil {
			return nil, err
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return nil, err
	}

	if in.DeleteLogoImage || in.DeleteBackgroundImage {
		err = service.gradeSettingStorage.DocumentTemplateDeleteImage(in.Id, in.DeleteLogoImage, in.DeleteBackgroundImage)
		if err != nil {
			return nil, err
		}
	}

	return &DocumentTemplateUpdateData{}, nil
}
