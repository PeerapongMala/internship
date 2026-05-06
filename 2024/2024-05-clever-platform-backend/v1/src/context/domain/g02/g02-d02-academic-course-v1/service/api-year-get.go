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

type YearGetResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.YearEntity `json:"data"`
	Message    string                `json:"message"`
}

func (api *APIStruct) YearGet(context *fiber.Ctx) error {
	yearId, err := context.ParamsInt("yearId")
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

	yearGetOutput, err := api.Service.YearGet(&YearGetInput{
		Roles:     roles,
		SubjectId: subjectId,
		YearId:    yearId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(YearGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.YearEntity{*yearGetOutput.YearEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type YearGetInput struct {
	Roles     []int
	SubjectId string
	YearId    int
}

type YearGetOutput struct {
	*constant.YearEntity
}

func (service *serviceStruct) YearGet(in *YearGetInput) (*YearGetOutput, error) {
	curriculumGroupId, err := service.academicCourseStorage.YearCaseGetCurriculumGroupId(in.YearId)
	if err != nil {
		return nil, err
	}

	contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
	if err != nil {
		return nil, err
	}
	log.Println(in.Roles)
	log.Println(in.SubjectId)
	log.Println(contentCreators)

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

	year, err := service.academicCourseStorage.YearGet(in.YearId)
	if err != nil {
		return nil, err
	}

	return &YearGetOutput{
		year,
	}, nil
}
