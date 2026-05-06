package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"log"
	"net/http"
)

type DocumentTemplateListRequest struct {
	Id         *int    `query:"id"`
	Name       *string `query:"name"`
	SchoolID   *int    `query:"school_id" validate:"required"`
	FormatID   *string `query:"format_id"`
	IsDefault  *bool   `query:"is_default"`
	Pagination *helper.Pagination
}

// ==================== Response ==========================

type DocumentTemplateListResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.GradeDocumentTemplate `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) DocumentTemplateList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &DocumentTemplateListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request.Pagination = helper.PaginationNew(context)

	output, err := api.Service.DocumentTemplateList(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(DocumentTemplateListResponse{
		StatusCode: http.StatusOK,
		Pagination: request.Pagination,
		Data:       output,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) DocumentTemplateList(in *DocumentTemplateListRequest) ([]constant.GradeDocumentTemplate, error) {
	list, err := service.gradeSettingStorage.DocumentTemplateList(in.SchoolID, in.FormatID, in.Pagination, in.IsDefault, in.Id, in.Name)
	if err != nil {
		return nil, err
	}

	for i, v := range list {
		if v.LogoImage != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*v.LogoImage)
			if err != nil {
				log.Printf("Error while generating url for logo image %v: %v", *v.LogoImage, err)
				return nil, err
			}
			list[i].LogoImage = url
		}

		if v.BackgroundImage != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*v.BackgroundImage)
			if err != nil {
				log.Printf("Error while generating url for background image %v: %v", *v.BackgroundImage, err)
				return nil, err
			}
			list[i].BackgroundImage = url
		}
	}

	return list, nil
}
