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

type SubjectGroupUpdateRequest struct {
	Status             string  `json:"status"`
	SeedSubjectGroupId int     `json:"seed_subject_group_id"`
	AdminLoginAs       *string `json:"admin_login_as"`
	FullOption         *bool   `json:"full_option"`
	Theme              *string `json:"theme"`
	Url                *string `json:"url"`
}

// ==================== Response ==========================

type SubjectGroupUpdateResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       []constant.SubjectGroupEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectGroupUpdate(context *fiber.Ctx) error {
	subjectGroupId, err := context.ParamsInt("subjectGroupId")
	if err != nil {
		msg := "Invalid subject group Id"
		err := helper.NewHttpError(http.StatusBadRequest, &msg)
		log.Printf("%+v", errors.WithStack(err))
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

	request, err := helper.ParseAndValidateRequest(context, &SubjectGroupUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = constant.ValidateStatus(request.Status)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectUpdateOutput, err := api.Service.SubjectGroupUpdate(&SubjectGroupUpdateInput{
		Roles:                     roles,
		SubjectGroupUpdateRequest: request,
		SubjectGroupId:            subjectGroupId,
		SubjectId:                 subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectGroupUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubjectGroupEntity{*subjectUpdateOutput.SubjectGroup},
		Message:    "Subject group updated",
	})
}

// ==================== Service ==========================

type SubjectGroupUpdateInput struct {
	Roles []int
	*SubjectGroupUpdateRequest
	SubjectGroupId int
	SubjectId      string
}

type SubjectGroupUpdateOutput struct {
	SubjectGroup *constant.SubjectGroupEntity
}

func (service *serviceStruct) SubjectGroupUpdate(in *SubjectGroupUpdateInput) (*SubjectGroupUpdateOutput, error) {
	// validate content creator
	curriculumGroupId, err := service.academicCourseStorage.SubjectGroupCaseGetCurriculumGroupId(in.SubjectGroupId)
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

	subjectGroup, err := service.academicCourseStorage.SubjectGroupGet(in.SubjectGroupId)
	if err != nil {
		return nil, err
	}

	err = constant.ValidateNewStatus(subjectGroup.Status, in.Status)
	if err != nil {
		return nil, err
	}

	subjectGroupEntity := constant.SubjectGroupEntity{}
	err = copier.Copy(&subjectGroupEntity, in.SubjectGroupUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	subjectGroupEntity.Id = in.SubjectGroupId
	now := time.Now().UTC()
	subjectGroupEntity.UpdatedAt = &now
	subjectGroupEntity.UpdatedBy = &in.SubjectId

	updatedSubjectGroup, err := service.academicCourseStorage.SubjectGroupUpdate(nil, &subjectGroupEntity)
	if err != nil {
		return nil, err
	}

	return &SubjectGroupUpdateOutput{
		SubjectGroup: updatedSubjectGroup,
	}, nil
}
