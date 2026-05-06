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

type SubjectGetResponse struct {
	StatusCode int                      `json:"status_code"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

func (api *APIStruct) SubjectGet(context *fiber.Ctx) error {
	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subject, err := api.Service.SubjectGet(&SubjectGetInput{
		Roles:     roles,
		UserId:    userId,
		SubjectId: subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubjectEntity{*subject.SubjectEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectGetInput struct {
	Roles     []int
	UserId    string
	SubjectId int
}

type SubjectGetOutput struct {
	*constant.SubjectEntity
}

func (service *serviceStruct) SubjectGet(in *SubjectGetInput) (*SubjectGetOutput, error) {
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

	subject, err := service.academicCourseStorage.SubjectGet(in.SubjectId)
	if err != nil {
		return nil, err
	}

	if subject.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*subject.ImageUrl)
		if err != nil {
			return nil, err
		}
		subject.ImageUrl = url
	}

	return &SubjectGetOutput{subject}, nil
}
