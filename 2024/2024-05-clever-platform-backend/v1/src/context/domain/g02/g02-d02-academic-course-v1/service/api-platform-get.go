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

type PlatformGetRequest struct {
	PlatformId int `params:"platformId" validate:"required"`
}

// ==================== Response ==========================

type PlatformGetResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.PlatformEntity `json:"data"`
	Message    string                    `json:"message"`
}

func (api *APIStruct) PlatformGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &PlatformGetRequest{}, helper.ParseOptions{Params: true})
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

	platformGetOutput, err := api.Service.PlatformGet(&PlatformGetInput{
		Roles:      roles,
		SubjectId:  subjectId,
		PlatformId: request.PlatformId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(PlatformGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.PlatformEntity{*platformGetOutput.PlatformEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type PlatformGetInput struct {
	Roles      []int
	SubjectId  string
	PlatformId int
}

type PlatformGetOutput struct {
	*constant.PlatformEntity
}

func (service *serviceStruct) PlatformGet(in *PlatformGetInput) (*PlatformGetOutput, error) {
	curriculumGroupId, err := service.academicCourseStorage.PlatformCaseGetCurriculumGroupId(in.PlatformId)
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

	platform, err := service.academicCourseStorage.PlatformGet(in.PlatformId)
	if err != nil {
		return nil, err
	}

	return &PlatformGetOutput{
		platform,
	}, nil
}
