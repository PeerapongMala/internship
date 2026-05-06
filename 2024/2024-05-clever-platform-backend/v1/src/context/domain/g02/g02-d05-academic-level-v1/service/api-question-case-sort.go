package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type QuestionCaseSortRequest struct {
	LevelId   int         `params:"levelId" validate:"required"`
	Questions map[int]int `json:"questions" validate:"required"`
}

// ==================== Response ==========================

type QuestionCaseSortResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionCaseSort(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionCaseSortRequest{}, helper.ParseOptions{Params: true, Body: true})
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

	err = api.Service.QuestionCaseSort(&QuestionCaseSortInput{
		Roles:                   roles,
		SubjectId:               subjectId,
		QuestionCaseSortRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionCaseSortResponse{
		StatusCode: http.StatusOK,
		Message:    "Questions sorted",
	})
}

// ==================== Service ==========================

type QuestionCaseSortInput struct {
	Roles     []int
	SubjectId string
	*QuestionCaseSortRequest
}

func (service *serviceStruct) QuestionCaseSort(in *QuestionCaseSortInput) error {
	curriculumGroupId, err := service.academicLevelStorage.LevelCaseGetCurriculumGroupId(in.LevelId)
	if err != nil {
		return err
	}

	err = service.CheckContentCreator(&CheckContentCreatorInput{
		SubjectId:         in.SubjectId,
		Roles:             in.Roles,
		CurriculumGroupId: *curriculumGroupId,
	})
	if err != nil {
		return err
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.academicLevelStorage.QuestionCaseSort(tx, in.Questions, in.LevelId)
	if err != nil {
		return err
	}

	level, err := service.academicLevelStorage.LevelGet(in.LevelId)
	if err != nil {
		return err
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, []int{level.SubLessonId}, false, in.SubjectId)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
