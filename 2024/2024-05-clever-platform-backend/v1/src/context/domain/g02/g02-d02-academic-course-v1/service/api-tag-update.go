package service

import (
	"log"
	"net/http"
	"slices"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type TagUpdateRequest struct {
	Name         string  `json:"name"`
	Status       string  `json:"status"`
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type TagUpdateResponse struct {
	StatusCode int                  `json:"status_code"`
	Data       []constant.TagEntity `json:"data"`
	Message    string               `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TagUpdate(context *fiber.Ctx) error {
	tagId, err := context.ParamsInt("tagId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &TagUpdateRequest{})
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

	tagUpdateOutput, err := api.Service.TagUpdate(&TagUpdateInput{
		SubjectId:        subjectId,
		Roles:            roles,
		TagId:            tagId,
		TagUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TagUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.TagEntity{*tagUpdateOutput.TagEntity},
		Message:    "Tag updated",
	})
}

// ==================== Service ==========================

type TagUpdateInput struct {
	SubjectId string
	Roles     []int
	TagId     int
	*TagUpdateRequest
}

type TagUpdateOutput struct {
	*constant.TagEntity
}

func (service *serviceStruct) TagUpdate(in *TagUpdateInput) (*TagUpdateOutput, error) {
	curriculumGroupId, err := service.academicCourseStorage.TagCaseGetCurriculumGroupId(in.TagId)
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

	tagEntity := constant.TagEntity{}
	err = copier.Copy(&tagEntity, in.TagUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	tagEntity.Id = in.TagId
	now := time.Now().UTC()
	tagEntity.UpdatedAt = &now
	tagEntity.UpdatedBy = &in.SubjectId

	tag, err := service.academicCourseStorage.TagUpdate(&tagEntity)
	if err != nil {
		return nil, err
	}

	return &TagUpdateOutput{
		tag,
	}, nil
}
