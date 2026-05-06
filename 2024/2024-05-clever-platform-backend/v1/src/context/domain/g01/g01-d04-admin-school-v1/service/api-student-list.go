package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentListResponse struct {
	StatusCode int                                   `json:"status_code"`
	Pagination *helper.Pagination                    `json:"_pagination"`
	Data       []constant.StudentDataWithOauthEntity `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentList(context *fiber.Ctx) error {
	schoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	pagination := helper.PaginationNew(context)
	studentFilter, err := helper.ParseAndValidateRequest(context, &constant.StudentFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	studentFilter.SchoolId = schoolId

	studentListOutput, err := api.Service.StudentList(&StudentListInput{
		Filter:     studentFilter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       studentListOutput.Students,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentListInput struct {
	Filter     *constant.StudentFilter
	Pagination *helper.Pagination
}

type StudentListOutput struct {
	Students []constant.StudentDataWithOauthEntity
}

func (service *serviceStruct) StudentList(in *StudentListInput) (*StudentListOutput, error) {
	studentDataWithOauthList, err := service.adminSchoolStorage.StudentList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	for i, studentDataWithOauth := range studentDataWithOauthList {
		if studentDataWithOauth.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*studentDataWithOauth.ImageUrl)
			if err != nil {
				return nil, err
			}
			studentDataWithOauthList[i].ImageUrl = url
		}
	}

	return &StudentListOutput{
		studentDataWithOauthList,
	}, nil
}
