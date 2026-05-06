package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ===========================

type GetSchoolDetailsByClassIdRequest struct {
	ClassId int `params:"classId" validate:"required"`
}

type GetSchoolDetailsByClassIdResponse struct {
	SchoolId       *string `json:"school_id"`
	SchoolCode     *string `json:"school_code"`
	SchoolName     *string `json:"school_name"`
	SchoolImageUrl *string `json:"school_image_url"`
}

// ==================== Response ==========================

type LevelListResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GetSchoolDetailsByClassId(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &GetSchoolDetailsByClassIdRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	getSchoolDetailsByClassIdOutput, err := api.Service.GetSchoolDetailsByClassId(&GetSchoolDetailsByClassIdInput{
		Pagination:                       pagination,
		GetSchoolDetailsByClassIdRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelListResponse{
		StatusCode: http.StatusOK,
		Data:       []interface{}{getSchoolDetailsByClassIdOutput.SchoolDetails},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type GetSchoolDetailsByClassIdInput struct {
	Pagination *helper.Pagination
	*GetSchoolDetailsByClassIdRequest
}

type GetSchoolDetailsByClassIdOutput struct {
	SchoolDetails constant.SchoolDetails
}

func (service *serviceStruct) GetSchoolDetailsByClassId(in *GetSchoolDetailsByClassIdInput) (*GetSchoolDetailsByClassIdOutput, error) {
	schoolDetails, err := service.lineParentStorage.GetSchoolDetailsByClassId(in.ClassId)
	if err != nil {
		return nil, err
	}

	if schoolDetails.SchoolImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*schoolDetails.SchoolImageUrl)
		if err != nil {
			return nil, err
		}
		schoolDetails.SchoolImageUrl = url
	}

	return &GetSchoolDetailsByClassIdOutput{
		SchoolDetails: *schoolDetails,
	}, nil
}
