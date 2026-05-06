package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type YearListResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.YearWithSubjectEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) YearList(context *fiber.Ctx) error {
	platformId, err := context.ParamsInt("platformId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	pagination := helper.PaginationNew(context)
	filter := constant.YearFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	yearListOutput, err := api.Service.YearList(&YearListInput{
		Roles:      roles,
		PlatformId: platformId,
		SubjectId:  subjectId,
		Pagination: pagination,
		Filter:     &filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(YearListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       yearListOutput.Years,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type YearListInput struct {
	Roles      []int
	PlatformId int
	SubjectId  string
	Pagination *helper.Pagination
	Filter     *constant.YearFilter
}

type YearListOutput struct {
	Years []constant.YearWithSubjectEntity
}

func (service *serviceStruct) YearList(in *YearListInput) (*YearListOutput, error) {
	platform, err := service.academicCourseStorage.PlatformGet(in.PlatformId)
	if err != nil {
		return nil, err
	}

	contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(platform.CurriculumGroupId)
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

	years, err := service.academicCourseStorage.YearList(in.PlatformId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}
	return &YearListOutput{
		Years: years,
	}, nil
}
