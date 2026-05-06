package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"slices"
	"time"
)

// ==================== Request ===========================

type PlatformUpdateRequest struct {
	PlatformId     int     `params:"platformId" validate:"required"`
	SeedPlatformId int     `json:"seed_platform_id"`
	Status         string  `json:"status"`
	AdminLoginAs   *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type PlatformUpdateResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.PlatformEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) PlatformUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &PlatformUpdateRequest{}, helper.ParseOptions{Body: true, Params: true})
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

	platformUpdateOutput, err := api.Service.PlatformUpdate(&PlatformUpdateInput{
		Roles:                 roles,
		SubjectId:             subjectId,
		PlatformUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&PlatformUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.PlatformEntity{*platformUpdateOutput.PlatformEntity},
		Message:    "Platform updated",
	})
}

// ==================== Service ==========================

type PlatformUpdateInput struct {
	Roles     []int
	SubjectId string
	*PlatformUpdateRequest
}

type PlatformUpdateOutput struct {
	*constant.PlatformEntity
}

func (service *serviceStruct) PlatformUpdate(in *PlatformUpdateInput) (*PlatformUpdateOutput, error) {
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

	err = constant.ValidateNewStatus(platform.Status, in.Status)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	platformEntity := constant.PlatformEntity{
		Id:             platform.Id,
		SeedPlatformId: in.SeedPlatformId,
		Status:         in.Status,
		UpdatedAt:      &now,
		UpdatedBy:      &in.SubjectId,
		AdminLoginAs:   in.AdminLoginAs,
	}

	updatedPlatform, err := service.academicCourseStorage.PlatformUpdate(nil, &platformEntity)
	if err != nil {
		return nil, err
	}

	return &PlatformUpdateOutput{
		updatedPlatform,
	}, nil
}
