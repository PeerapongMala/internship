package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type LevelCaseListQuestionRequest struct {
	LevelId int `params:"levelId" validate:"required"`
}

// ==================== Response ==========================

type LevelCaseListQuestionResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       interface{}        `json:"data"`
	Message    string             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseListQuestion(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelCaseListQuestionRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

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

	levelCaseListQuestionOutput, err := api.Service.LevelCaseListQuestion(&LevelCaseListQuestionInput{
		Roles:                        roles,
		SubjectId:                    subjectId,
		Pagination:                   pagination,
		LevelCaseListQuestionRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelCaseListQuestionResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelCaseListQuestionOutput.Questions,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelCaseListQuestionInput struct {
	Roles      []int
	SubjectId  string
	Pagination *helper.Pagination
	*LevelCaseListQuestionRequest
}

type LevelCaseListQuestionOutput struct {
	Questions interface{}
}

func (service *serviceStruct) LevelCaseListQuestion(in *LevelCaseListQuestionInput) (*LevelCaseListQuestionOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.LevelCaseGetCurriculumGroupId(in.LevelId)
	if err != nil {
		return nil, err
	}

	// TODO: student auth
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

	questions, err := service.academicLevelStorage.QuestionCaseListByLevelId(in.LevelId, in.Pagination)
	if err != nil {
		return nil, err
	}

	getFullQuestionsOutput, err := service.GetFullQuestions(&GetFullQuestionsInput{
		questions,
	})
	if err != nil {
		return nil, err
	}

	return &LevelCaseListQuestionOutput{
		getFullQuestionsOutput.FullQuestions,
	}, nil
}
