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

type TagGetResponse struct {
	StatusCode int                  `json:"status_code"`
	Data       []constant.TagEntity `json:"data"`
	Message    string               `json:"message"`
}

func (api *APIStruct) TagGet(context *fiber.Ctx) error {
	tagId, err := context.ParamsInt("tagId")
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

	tagGetOutput, err := api.Service.TagGet(&TagGetInput{
		TagId:     tagId,
		SubjectId: subjectId,
		Roles:     roles,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TagGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.TagEntity{*tagGetOutput.TagEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TagGetInput struct {
	Roles     []int
	SubjectId string
	TagId     int `json:"tag_id"`
}

type TagGetOutput struct {
	*constant.TagEntity
}

func (service *serviceStruct) TagGet(in *TagGetInput) (*TagGetOutput, error) {
	curriculumGroupId, err := service.academicCourseStorage.TagCaseGetCurriculumGroupId(in.TagId)
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

	tag, err := service.academicCourseStorage.TagGet(in.TagId)
	if err != nil {
		return nil, err
	}

	return &TagGetOutput{
		TagEntity: tag,
	}, nil
}
