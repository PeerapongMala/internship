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

type SubLessonCaseGetStandardResponse struct {
	StatusCode int                                `json:"status_code"`
	Data       []constant.SubLessonStandardEntity `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonCaseGetStandard(context *fiber.Ctx) error {
	subLessonId, err := context.ParamsInt("subLessonId")
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

	subLessonCaseGetStandardOutput, err := api.Service.SubLessonCaseGetStandard(&SubLessonCaseGetStandardInput{
		Roles:       roles,
		SubjectId:   subjectId,
		SubLessonId: subLessonId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonCaseGetStandardResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubLessonStandardEntity{*subLessonCaseGetStandardOutput.Standard},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubLessonCaseGetStandardInput struct {
	Roles       []int
	SubjectId   string
	SubLessonId int
}

type SubLessonCaseGetStandardOutput struct {
	Standard *constant.SubLessonStandardEntity
}

func (service *serviceStruct) SubLessonCaseGetStandard(in *SubLessonCaseGetStandardInput) (*SubLessonCaseGetStandardOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.SubLessonCaseGetCurriculumGroupId(in.SubLessonId)
	if err != nil {
		return nil, err
	}

	if !slices.Contains(in.Roles, int(userConstant.Student)) && !slices.Contains(in.Roles, int(userConstant.Teacher)) && !slices.Contains(in.Roles, int(userConstant.Observer)) {
		err = service.CheckContentCreator(&CheckContentCreatorInput{
			SubjectId:         in.SubjectId,
			Roles:             in.Roles,
			CurriculumGroupId: *curriculumGroupId,
		})
		if err != nil {
			return nil, err
		}
	}

	subLessonStandard, err := service.academicLevelStorage.SubLessonCaseGetStandard(in.SubLessonId)
	if err != nil {
		return nil, err
	}

	return &SubLessonCaseGetStandardOutput{
		subLessonStandard,
	}, nil
}
