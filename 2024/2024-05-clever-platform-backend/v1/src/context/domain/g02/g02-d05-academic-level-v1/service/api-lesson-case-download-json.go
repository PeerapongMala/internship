package service

import (
	"fmt"
	"log"
	"net/http"
	"sort"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type LessonCaseDownloadJsonRequest struct {
	SubLessonId int  `params:"subLessonId" validate:"required"`
	NoQuestion  bool `query:"no_question"`
	*constant.LevelFilter
}

// ==================== Response ==========================

type LessonCaseDownloadJsonResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.LevelListDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseDownloadJson(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonCaseDownloadJsonRequest{}, helper.ParseOptions{Params: true, Query: true})
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

	levelListOutput, err := api.Service.LessonCaseDownloadJson(&LessonCaseDownloadJsonInput{
		Roles:                         roles,
		SubjectId:                     subjectId,
		Pagination:                    pagination,
		LessonCaseDownloadJsonRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "application/json")
	context.Set("Content-Disposition", fmt.Sprintf("attachment; filename=%d.json", request.SubLessonId))
	return context.Status(http.StatusOK).JSON(levelListOutput)
}

// ==================== Service ==========================

type LessonCaseDownloadJsonInput struct {
	Roles      []int
	SubjectId  string
	Pagination *helper.Pagination
	*LessonCaseDownloadJsonRequest
}

type LessonCaseDownloadJsonOutput struct {
	Levels []constant.LevelListDataEntity `json:"levels"`
}

func (service *serviceStruct) LessonCaseDownloadJson(in *LessonCaseDownloadJsonInput) (*LessonCaseDownloadJsonOutput, error) {
	levels, err := service.academicLevelStorage.LevelList(in.SubLessonId, in.LevelFilter, nil, false)
	if err != nil {
		return nil, err
	}
	sort.Slice(levels, func(i, j int) bool {
		return levels[i].Index < levels[j].Index
	})

	if !in.NoQuestion {
		for i, level := range levels {
			questions, err := service.academicLevelStorage.QuestionCaseListByLevelId(level.Id, nil)
			if err != nil {
				return nil, err
			}

			getFullQuestionsOutput, err := service.GetFullQuestions(&GetFullQuestionsInput{
				questions,
			})
			if err != nil {
				return nil, err
			}

			levels[i].Questions = getFullQuestionsOutput.FullQuestions
		}
	}

	return &LessonCaseDownloadJsonOutput{
		Levels: levels,
	}, nil
}
