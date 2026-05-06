package service

import (
	"net/http"
	"slices"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type TagCreateRequest struct {
	TagGroupId   int     `json:"tag_group_id" validate:"required"`
	Name         string  `json:"name" validate:"required"`
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type TagCreateResponse struct {
	StatusCode int                  `json:"status_code"`
	Data       []constant.TagEntity `json:"data"`
	Message    string               `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TagCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TagCreateRequest{})
	if err != nil {
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

	tagCreateOutput, err := api.Service.TagCreate(&TagCreateInput{
		SubjectId:        subjectId,
		Roles:            roles,
		TagCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(TagCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.TagEntity{*tagCreateOutput.TagEntity},
		Message:    "Tag created",
	})
}

// ==================== Service ==========================

type TagCreateInput struct {
	SubjectId string
	Roles     []int
	*TagCreateRequest
}

type TagCreateOutput struct {
	*constant.TagEntity
}

func (service *serviceStruct) TagCreate(in *TagCreateInput) (*TagCreateOutput, error) {
	curriculumGroupId, err := service.academicCourseStorage.TagGroupCaseGetCurriculumGroupId(in.TagGroupId)
	if err != nil {
		return nil, err
	}
	// validate content creator
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

	tagEntity := constant.TagEntity{
		TagGroupId:   in.TagGroupId,
		Name:         in.Name,
		Status:       string(constant.Enabled),
		CreatedAt:    time.Now().UTC(),
		CreatedBy:    in.SubjectId,
		AdminLoginAs: in.AdminLoginAs,
	}
	tag, err := service.academicCourseStorage.TagCreate(&tagEntity)
	if err != nil {
		return nil, err
	}

	return &TagCreateOutput{
		tag,
	}, nil
}
