package service

import (
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubjectListResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.SubjectDataEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter, err := helper.ParseAndValidateRequest(context, &constant.SubjectFilter{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectListOutput, err := api.Service.SubjectList(&SubjectListInput{
		Roles:         roles,
		SubjectId:     subjectId,
		Pagination:    pagination,
		SubjectFilter: filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectListOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectListInput struct {
	Roles      []int
	SubjectId  string
	Pagination *helper.Pagination
	*constant.SubjectFilter
}

type SubjectListOutput struct {
	Subjects []constant.SubjectDataEntity
}

func (service *serviceStruct) SubjectList(in *SubjectListInput) (*SubjectListOutput, error) {
	var curriculumGroupId int
	if in.SubjectGroupId != 0 {
		id, err := service.academicCourseStorage.SubjectGroupCaseGetCurriculumGroupId(in.SubjectGroupId)
		if err != nil {
			return nil, err
		}
		curriculumGroupId = *id
	}
	if in.CurriculumGroupId != 0 {
		curriculumGroupId = in.CurriculumGroupId
	}

	contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(curriculumGroupId)
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

	subjects, err := service.academicCourseStorage.SubjectList(in.SubjectFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	for i, subject := range subjects {
		translationLanguages, err := service.academicCourseStorage.SubjectTranslationCaseListBySubject(subject.Id)
		if err != nil {
			return nil, err
		}
		subjects[i].SubjectTranslationLanguages = translationLanguages

		if subject.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*subject.ImageUrl)
			if err != nil {
				return nil, err
			}
			subject.ImageUrl = url
		}
	}

	return &SubjectListOutput{
		Subjects: subjects,
	}, nil
}
