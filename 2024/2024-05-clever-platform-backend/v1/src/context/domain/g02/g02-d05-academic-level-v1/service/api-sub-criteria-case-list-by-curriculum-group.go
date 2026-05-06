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

type SubCriteriaCaseListByCurriculumGroupResponse struct {
	StatusCode int                              `json:"status_code"`
	Data       []constant.SubCriteriaDataEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubCriteriaCaseListByCurriculumGroup(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subCriteriaCaseListByCurriculumGroupOutput, err := api.Service.SubCriteriaCaseListByCurriculumGroup(&SubCriteriaCaseListByCurriculumGroupInput{
		Roles:             roles,
		SubjectId:         subjectId,
		CurriculumGroupId: curriculumGroupId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubCriteriaCaseListByCurriculumGroupResponse{
		StatusCode: http.StatusOK,
		Data:       subCriteriaCaseListByCurriculumGroupOutput.SubCriteria,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubCriteriaCaseListByCurriculumGroupInput struct {
	Roles             []int
	SubjectId         string
	CurriculumGroupId int
}

type SubCriteriaCaseListByCurriculumGroupOutput struct {
	SubCriteria []constant.SubCriteriaDataEntity
}

func (service *serviceStruct) SubCriteriaCaseListByCurriculumGroup(in *SubCriteriaCaseListByCurriculumGroupInput) (*SubCriteriaCaseListByCurriculumGroupOutput, error) {
	contentCreators, err := service.academicLevelStorage.CurriculumGroupCaseListContentCreator(in.CurriculumGroupId)
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

	subCriteria, err := service.academicLevelStorage.SubCriteriaCaseListByCurriculumGroup(in.CurriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SubCriteriaCaseListByCurriculumGroupOutput{
		SubCriteria: subCriteria,
	}, nil
}
