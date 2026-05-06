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

// ==================== Request ==========================

type TagGroupUpdateRequest struct {
	Name string `json:"name"`
}

type TagGroupUpdateResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.TagGroupEntity `json:"data"`
	Message    string                    `json:"message"`
}

func (api *APIStruct) TagGroupUpdate(context *fiber.Ctx) error {
	tagGroupId, err := context.ParamsInt("tagGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &TagGroupUpdateRequest{})
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

	tagGroupUpdateOutput, err := api.Service.TagGroupUpdate(&TagGroupUpdateInput{
		SubjectId:             subjectId,
		Roles:                 roles,
		TagGroupId:            tagGroupId,
		TagGroupUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TagGroupUpdateResponse{
		StatusCode: http.StatusOK,
		Data: []constant.TagGroupEntity{
			*tagGroupUpdateOutput.TagGroupEntity,
		},
		Message: "Tag group updated",
	})
}

// ==================== Service ==========================

type TagGroupUpdateInput struct {
	SubjectId  string
	Roles      []int
	TagGroupId int
	*TagGroupUpdateRequest
}

type TagGroupUpdateOutput struct {
	*constant.TagGroupEntity
}

func (service *serviceStruct) TagGroupUpdate(in *TagGroupUpdateInput) (*TagGroupUpdateOutput, error) {
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

	tagGroupEntity := constant.TagGroupEntity{
		Name: in.Name,
	}
	tagGroupEntity.Id = in.TagGroupId

	tagGroup, err := service.academicCourseStorage.TagGroupUpdate(&tagGroupEntity)
	if err != nil {
		return nil, err
	}

	return &TagGroupUpdateOutput{
		tagGroup,
	}, nil
}
