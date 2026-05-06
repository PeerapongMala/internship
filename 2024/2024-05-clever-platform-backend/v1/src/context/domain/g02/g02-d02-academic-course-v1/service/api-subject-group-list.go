package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ===========================

// ==================== Response ==========================

type SubjectGroupListResponse struct {
	StatusCode int                                      `json:"status_code"`
	Pagination *helper.Pagination                       `json:"_pagination"`
	Data       []constant.SubjectGroupWithSubjectEntity `json:"data"`
	Message    string                                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectGroupList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	yearId, err := context.ParamsInt("yearId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	filter := constant.SubjectGroupFilter{}
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

	subjectListOutput, err := api.Service.SubjectGroupList(&SubjectGroupListInput{
		Roles:      roles,
		YearId:     yearId,
		SubjectId:  subjectId,
		Pagination: pagination,
		Filter:     &filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectGroupListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectListOutput.SubjectsGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectGroupListInput struct {
	Roles      []int
	YearId     int
	SubjectId  string
	Pagination *helper.Pagination
	Filter     *constant.SubjectGroupFilter
}

type SubjectGroupListOutput struct {
	SubjectsGroups []constant.SubjectGroupWithSubjectEntity
}

func (service *serviceStruct) SubjectGroupList(in *SubjectGroupListInput) (*SubjectGroupListOutput, error) {
	year, err := service.academicCourseStorage.YearGet(in.YearId)
	if err != nil {
		return nil, err
	}

	// validate content creator
	contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(year.CurriculumGroupId)
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

	subjectGroups, err := service.academicCourseStorage.SubjectGroupList(in.YearId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SubjectGroupListOutput{
		SubjectsGroups: subjectGroups,
	}, nil
}
