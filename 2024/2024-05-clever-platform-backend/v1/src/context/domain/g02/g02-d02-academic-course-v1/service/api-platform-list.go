package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"slices"
)

// ==================== Request ==========================

type PlatformListRequest struct {
	*constant.PlatformFilter
}

// ==================== Response ==========================

type PlatformListResponse struct {
	StatusCode int                                   `json:"status_code"`
	Pagination *helper.Pagination                    `json:"_pagination"`
	Data       []constant.PlatformWithSubjectsEntity `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) PlatformList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &PlatformListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	platformListOutput, err := api.Service.PlatformList(&PlatformListInput{
		Roles:               roles,
		SubjectId:           subjectId,
		Pagination:          pagination,
		PlatformListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(PlatformListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       platformListOutput.Platforms,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type PlatformListInput struct {
	Roles      []int
	SubjectId  string
	Pagination *helper.Pagination
	*PlatformListRequest
}

type PlatformListOutput struct {
	Platforms []constant.PlatformWithSubjectsEntity
}

func (service *serviceStruct) PlatformList(in *PlatformListInput) (*PlatformListOutput, error) {
	contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(in.CurriculumGroupId)
	if err != nil {
		return nil, err
	}
	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		isValid := false
		for _, contentCreator := range contentCreators {
			if contentCreator.Id == in.SubjectId {
				isValid = true
				break
			}
		}
		if !isValid || len(contentCreators) == 0 {
			msg := "User isn't content creator of this curriculum group"
			return nil, helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	platforms, err := service.academicCourseStorage.PlatformList(in.PlatformFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &PlatformListOutput{
		platforms,
	}, nil
}
