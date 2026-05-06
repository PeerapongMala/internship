package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"log"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubjectGroupGetResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       []constant.SubjectGroupEntity `json:"data"`
	Message    string                        `json:"message"`
}

func (api *APIStruct) SubjectGroupGet(context *fiber.Ctx) error {
	subjectGroupId, err := context.ParamsInt("subjectGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectGroupGetOutput, err := api.Service.SubjectGroupGet(&SubjectGroupGetInput{
		Roles:          roles,
		SubjectId:      subjectId,
		SubjectGroupId: subjectGroupId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectGroupGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubjectGroupEntity{*subjectGroupGetOutput.SubjectGroupEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectGroupGetInput struct {
	SubjectId      string
	Roles          []int
	SubjectGroupId int `json:"subject_group_id"`
}

type SubjectGroupGetOutput struct {
	*constant.SubjectGroupEntity
}

func (service *serviceStruct) SubjectGroupGet(in *SubjectGroupGetInput) (*SubjectGroupGetOutput, error) {
	curriculumGroupId, err := service.academicCourseStorage.SubjectGroupCaseGetCurriculumGroupId(in.SubjectGroupId)
	if err != nil {
		return nil, err
	}

	contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
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

	subjectGroup, err := service.academicCourseStorage.SubjectGroupGet(in.SubjectGroupId)
	if err != nil {
		return nil, err
	}

	return &SubjectGroupGetOutput{
		subjectGroup,
	}, nil
}
