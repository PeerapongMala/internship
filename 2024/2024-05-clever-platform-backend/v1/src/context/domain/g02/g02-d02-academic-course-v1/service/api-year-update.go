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

type YearUpdateRequest struct {
	SeedYearId   int     `json:"seed_year_id"`
	Status       string  `json:"status"`
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type YearUpdateResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.YearEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

// @Id YearUpdate
// @Tags Academic Courses
// @Summary Update year
// @Description อัพเดทชั้นปีของสังกัดวิชา
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param yearId path int true "yearId"
// @Param request body YearUpdateRequest true "request"
// @Success 200 {object} YearUpdateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /academic-courses/v1/years/{yearId} [patch]
func (api *APIStruct) YearUpdate(context *fiber.Ctx) error {
	yearId, err := context.ParamsInt("yearId")
	if err != nil {
		msg := "Invalid year id"
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

	request, err := helper.ParseAndValidateRequest(context, &YearUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = constant.ValidateStatus(request.Status)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	yearUpdateOutput, err := api.Service.YearUpdate(&YearUpdateInput{
		Roles:             roles,
		YearId:            yearId,
		YearUpdateRequest: request,
		SubjectId:         subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(YearUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.YearEntity{*yearUpdateOutput.YearEntity},
		Message:    "Curriculum group's year updated",
	})
}

// ==================== Service ==========================

type YearUpdateInput struct {
	Roles  []int
	YearId int
	*YearUpdateRequest
	SubjectId string
}

type YearUpdateOutput struct {
	*constant.YearEntity
}

func (service *serviceStruct) YearUpdate(in *YearUpdateInput) (*YearUpdateOutput, error) {
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

	err = constant.ValidateNewStatus(year.Status, in.Status)
	if err != nil {
		return nil, err
	}

	yearEntity := constant.YearEntity{}
	err = copier.Copy(&yearEntity, in.YearUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	yearEntity.Id = in.YearId
	now := time.Now().UTC()
	yearEntity.UpdatedAt = &now
	yearEntity.UpdatedBy = &in.SubjectId

	updatedYear, err := service.academicCourseStorage.YearUpdate(nil, &yearEntity)
	if err != nil {
		return nil, err
	}

	return &YearUpdateOutput{
		YearEntity: updatedYear,
	}, nil
}
