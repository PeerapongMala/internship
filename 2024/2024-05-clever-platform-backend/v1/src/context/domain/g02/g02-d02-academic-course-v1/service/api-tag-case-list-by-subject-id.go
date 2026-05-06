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

// ==================== Response ==========================

type TagCaseListBySubjectIdResponse struct {
	StatusCode int                               `json:"status_code"`
	Data       []constant.TagGroupWithTagsEntity `json:"data"`
	Message    string                            `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TagCaseListBySubjectId(context *fiber.Ctx) error {
	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	tagCaseListBySubjectIdOutput, err := api.Service.TagCaseListBySubjectId(&TagCaseListBySubjectIdInput{
		Roles:     roles,
		UserId:    userId,
		SubjectId: subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TagCaseListBySubjectIdResponse{
		StatusCode: http.StatusOK,
		Data:       tagCaseListBySubjectIdOutput.TagGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TagCaseListBySubjectIdInput struct {
	Roles     []int
	UserId    string
	SubjectId int
}

type TagCaseListBySubjectIdOutput struct {
	TagGroups []constant.TagGroupWithTagsEntity
}

func (service *serviceStruct) TagCaseListBySubjectId(in *TagCaseListBySubjectIdInput) (*TagCaseListBySubjectIdOutput, error) {
	curriculumGroupId, err := service.academicCourseStorage.SubjectCaseGetCurriculumGroupId(in.SubjectId)
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
			if contentCreator.Id == in.UserId {
				isValid = true
				break
			}
		}
		if !isValid || len(contentCreators) == 0 {
			msg := "User isn't content creator of this curriculum group"
			return nil, helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	tagGroupWithTags, err := service.academicCourseStorage.TagCaseListBySubjectId(in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &TagCaseListBySubjectIdOutput{
		TagGroups: tagGroupWithTags,
	}, nil

}
