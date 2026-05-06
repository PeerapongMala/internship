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

// ==================== Request ==========================

type PlatformCreateRequest struct {
	CurriculumGroupId int     `json:"curriculum_group_id" validate:"required"`
	SeedPlatformId    int     `json:"seed_platform_id" validate:"required"`
	Status            string  `json:"status" validate:"required"`
	AdminLoginAs      *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type PlatformCreateResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.PlatformEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) PlatformCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &PlatformCreateRequest{})
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

	platformCreateOutput, err := api.Service.PlatformCreate(&PlatformCreateInput{
		Roles:                 roles,
		PlatformCreateRequest: request,
		SubjectId:             subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(PlatformCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.PlatformEntity{*platformCreateOutput.PlatformEntity},
		Message:    "Platform created",
	})
}

// ==================== Service ==========================

type PlatformCreateInput struct {
	Roles []int
	*PlatformCreateRequest
	SubjectId string
}

type PlatformCreateOutput struct {
	*constant.PlatformEntity
}

func (service *serviceStruct) PlatformCreate(in *PlatformCreateInput) (*PlatformCreateOutput, error) {
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

	platformEntity := constant.PlatformEntity{
		CurriculumGroupId: in.CurriculumGroupId,
		SeedPlatformId:    in.SeedPlatformId,
		Status:            in.Status,
		CreatedAt:         time.Now().UTC(),
		CreatedBy:         in.SubjectId,
		AdminLoginAs:      in.AdminLoginAs,
	}

	platform, err := service.academicCourseStorage.PlatformCreate(&platformEntity)
	if err != nil {
		return nil, err
	}

	return &PlatformCreateOutput{
		PlatformEntity: platform,
	}, nil
}
