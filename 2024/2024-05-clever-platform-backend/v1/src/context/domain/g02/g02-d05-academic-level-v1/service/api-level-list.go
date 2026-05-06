package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"slices"
)

// ==================== Request ==========================

type LevelListRequest struct {
	SubLessonId int  `params:"subLessonId" validate:"required"`
	NoQuestion  bool `query:"no_question"`
	*constant.LevelFilter
}

// ==================== Response ==========================

type LevelListResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.LevelListDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelListRequest{}, helper.ParseOptions{Params: true, Query: true})
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

	levelListOutput, err := api.Service.LevelList(&LevelListInput{
		Roles:            roles,
		SubjectId:        subjectId,
		Pagination:       pagination,
		LevelListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelListOutput.Levels,
		Message:    "Data retrieved",
	})

}

// ==================== Service ==========================

type LevelListInput struct {
	Roles      []int
	SubjectId  string
	Pagination *helper.Pagination
	*LevelListRequest
}

type LevelListOutput struct {
	Levels []constant.LevelListDataEntity
}

func (service *serviceStruct) LevelList(in *LevelListInput) (*LevelListOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.SubLessonCaseGetCurriculumGroupId(in.SubLessonId)
	if err != nil {
		return nil, err
	}

	// TODO: student auth
	if !slices.Contains(in.Roles, int(userConstant.Student)) {
		err = service.CheckContentCreator(&CheckContentCreatorInput{
			SubjectId:         in.SubjectId,
			Roles:             in.Roles,
			CurriculumGroupId: *curriculumGroupId,
		})
		if err != nil {
			return nil, err
		}
	}

	levels, err := service.academicLevelStorage.LevelList(in.SubLessonId, in.LevelFilter, in.Pagination, false)
	if err != nil {
		return nil, err
	}

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

	return &LevelListOutput{
		Levels: levels,
	}, nil
}
