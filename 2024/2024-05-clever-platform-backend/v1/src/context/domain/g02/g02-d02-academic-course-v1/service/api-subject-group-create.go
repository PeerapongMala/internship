package service

import (
	"log"
	"net/http"
	"slices"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SubjectGroupCreateRequest struct {
	YearId             int     `json:"year_id" validate:"required"`
	SeedSubjectGroupId int     `json:"seed_subject_group_id" validate:"required"`
	Status             string  `json:"status" validate:"required"`
	AdminLoginAs       *string `json:"admin_login_as"`
	FullOption         *bool   `json:"full_option"`
	Theme              *string `json:"theme"`
	Url                *string `json:"url"`
}

// ==================== Response ==========================

type SubjectGroupCreateResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       []constant.SubjectGroupEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectGroupCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectGroupCreateRequest{})
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

	err = constant.ValidateStatus(request.Status)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectGroupCreateOutput, err := api.Service.SubjectGroupCreate(&SubjectGroupCreateInput{
		Roles:                     roles,
		SubjectId:                 subjectId,
		SubjectGroupCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SubjectGroupCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.SubjectGroupEntity{*subjectGroupCreateOutput.SubjectGroup},
		Message:    "Subject group created",
	})
}

// ==================== Service ==========================

type SubjectGroupCreateInput struct {
	Roles []int
	*SubjectGroupCreateRequest
	SubjectId string
}

type SubjectGroupCreateOutput struct {
	SubjectGroup *constant.SubjectGroupEntity
}

func (service *serviceStruct) SubjectGroupCreate(in *SubjectGroupCreateInput) (*SubjectGroupCreateOutput, error) {
	year, err := service.academicCourseStorage.YearGet(in.YearId)
	if err != nil {
		return nil, err
	}
	// validate content creator
	contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(year.CurriculumGroupId)
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

	subjectGroupEntity := constant.SubjectGroupEntity{}
	err = copier.Copy(&subjectGroupEntity, in)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	subjectGroupEntity.CreatedAt = time.Now().UTC()
	subjectGroupEntity.CreatedBy = in.SubjectId

	subjectGroup, err := service.academicCourseStorage.SubjectGroupCreate(&subjectGroupEntity)
	if err != nil {
		return nil, err
	}

	return &SubjectGroupCreateOutput{
		SubjectGroup: subjectGroup,
	}, nil
}
