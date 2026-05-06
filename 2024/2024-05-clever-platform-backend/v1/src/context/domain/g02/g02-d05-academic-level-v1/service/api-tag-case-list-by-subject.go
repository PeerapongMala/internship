package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type TagCaseListBySubjectResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.TagGroupEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TagCaseListBySubject(context *fiber.Ctx) error {
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

	tagCaseListBySubjectOutput, err := api.Service.TagCaseListBySubject(&TagCaseListBySubjectInput{
		Roles:     roles,
		UserId:    userId,
		SubjectId: subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TagCaseListBySubjectResponse{
		StatusCode: http.StatusOK,
		Data:       tagCaseListBySubjectOutput.TagGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TagCaseListBySubjectInput struct {
	Roles     []int
	UserId    string
	SubjectId int
}

type TagCaseListBySubjectOutput struct {
	TagGroups []constant.TagGroupEntity
}

func (service *serviceStruct) TagCaseListBySubject(in *TagCaseListBySubjectInput) (*TagCaseListBySubjectOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.SubjectCaseGetCurriculumGroupId(in.SubjectId)
	if err != nil {
		return nil, err
	}

	contentCreators, err := service.academicLevelStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
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

	tagGroups, err := service.academicLevelStorage.TagCaseListBySubject(in.SubjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &TagCaseListBySubjectOutput{TagGroups: tagGroups}, nil
}
