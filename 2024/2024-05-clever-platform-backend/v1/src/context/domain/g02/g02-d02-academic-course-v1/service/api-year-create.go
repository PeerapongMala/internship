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

type YearCreateRequest struct {
	CurriculumGroupId int     `json:"curriculum_group_id" validate:"required"`
	PlatformId        int     `json:"platform_id" validate:"required"`
	SeedYearId        int     `json:"seed_year_id" validate:"required"`
	Status            string  `json:"status" validate:"required"`
	AdminLoginAs      *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type YearCreateResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.YearEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

// @Id YearCreate
// @Tags Academic Courses
// @Summary Create year
// @Description เพิ่มชั้นปีของสังกัดวิชา
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body YearCreateRequest true "request"
// @Success 201 {object} YearCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /academic-courses/v1/years [post]
func (api *APIStruct) YearCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &YearCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = constant.ValidateStatus(request.Status)
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

	yearCreateOutput, err := api.Service.YearCreate(&YearCreateInput{
		Roles:             roles,
		YearCreateRequest: request,
		SubjectId:         subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(YearCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.YearEntity{*yearCreateOutput.YearEntity},
		Message:    "Curriculum group's year created",
	})
}

// ==================== Service ==========================

type YearCreateInput struct {
	Roles []int
	*YearCreateRequest
	SubjectId string
}

type YearCreateOutput struct {
	*constant.YearEntity
}

func (service *serviceStruct) YearCreate(in *YearCreateInput) (*YearCreateOutput, error) {
	// validate content creator
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

	yearEntity := constant.YearEntity{}
	err = copier.Copy(&yearEntity, in.YearCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, helper.NewHttpError(http.StatusInternalServerError, nil)
	}
	yearEntity.CurriculumGroupId = in.CurriculumGroupId
	yearEntity.PlatformId = in.PlatformId
	yearEntity.CreatedAt = time.Now().UTC()
	yearEntity.CreatedBy = in.SubjectId

	year, err := service.academicCourseStorage.YearCreate(nil, &yearEntity)
	if err != nil {
		return nil, err
	}

	return &YearCreateOutput{
		YearEntity: year,
	}, nil
}
