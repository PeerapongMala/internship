package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type QuestionGetRequest struct {
	QuestionId int `params:"questionId" validate:"required"`
}

// ==================== Response ==========================

type QuestionGetResponse struct {
	StatusCode int         `json:"status_code"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionGetRequest{}, helper.ParseOptions{Params: true})
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

	questionGetOutput, err := api.Service.QuestionGet(&QuestionGetInput{
		Roles:              roles,
		SubjectId:          subjectId,
		QuestionGetRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionGetResponse{
		StatusCode: http.StatusOK,
		Data:       questionGetOutput.Question,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type QuestionGetInput struct {
	Roles     []int
	SubjectId string
	*QuestionGetRequest
}

type QuestionGetOutput struct {
	Question interface{}
}

func (service *serviceStruct) QuestionGet(in *QuestionGetInput) (*QuestionGetOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.QuestionCaseGetCurriculumGroupId(in.QuestionId)
	if err != nil {
		return nil, err
	}

	err = service.CheckContentCreator(&CheckContentCreatorInput{
		SubjectId:         in.SubjectId,
		Roles:             in.Roles,
		CurriculumGroupId: *curriculumGroupId,
	})
	if err != nil {
		return nil, err
	}

	question, err := service.academicLevelStorage.QuestionGet(in.QuestionId)
	if err != nil {
		return nil, err
	}

	getFullQuestionsOutput, err := service.GetFullQuestions(&GetFullQuestionsInput{
		Questions: []constant.QuestionEntity{*question},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionGetOutput{
		getFullQuestionsOutput.FullQuestions,
	}, nil
}
