package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"log"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type LevelGetRequest struct {
	LevelId       int  `params:"levelId" validate:"required"`
	ListQuestions bool `query:"list_questions"`
}

// ==================== Response ==========================

type LevelGetResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       []constant.LevelGetDataEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelGetRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
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

	levelGetOutput, err := api.Service.LevelGet(&LevelGetInput{
		Roles:           roles,
		SubjectId:       subjectId,
		LevelGetRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.LevelGetDataEntity{*levelGetOutput.LevelGetDataEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelGetInput struct {
	Roles     []int
	SubjectId string
	*LevelGetRequest
}

type LevelGetOutput struct {
	*constant.LevelGetDataEntity
}

func (service *serviceStruct) LevelGet(in *LevelGetInput) (*LevelGetOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.LevelCaseGetCurriculumGroupId(in.LevelId)
	if err != nil {
		return nil, err
	}

	if !slices.Contains(in.Roles, int(userConstant.Student)) && !slices.Contains(in.Roles, int(userConstant.Teacher)) && !slices.Contains(in.Roles, int(userConstant.Parent)) && !slices.Contains(in.Roles, int(userConstant.Observer)) {
		err = service.CheckContentCreator(&CheckContentCreatorInput{
			SubjectId:         in.SubjectId,
			Roles:             in.Roles,
			CurriculumGroupId: *curriculumGroupId,
		})
		if err != nil {
			return nil, err
		}
	}

	level, err := service.academicLevelStorage.LevelGet(in.LevelId)
	if err != nil {
		return nil, err
	}

	standard, err := service.academicLevelStorage.LevelCaseGetStandard(level.Id)
	if err != nil {
		return nil, err
	}
	if standard != nil {
		level.Standard = *standard
	}

	questions, err := service.academicLevelStorage.QuestionCaseListByLevelId(in.LevelId, nil)
	if err != nil {
		return nil, err
	}

	if in.ListQuestions {
		getFullQuestionsOutput, err := service.GetFullQuestions(&GetFullQuestionsInput{
			questions,
		})
		if err != nil {
			return nil, err
		}
		level.Questions = getFullQuestionsOutput.FullQuestions
	}

	return &LevelGetOutput{
		level,
	}, nil
}
