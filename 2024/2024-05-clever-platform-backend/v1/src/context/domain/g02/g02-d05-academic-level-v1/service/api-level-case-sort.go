package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type LevelCaseSortRequest struct {
	SubLessonId int         `params:"subLessonId" validate:"required"`
	Levels      map[int]int `json:"levels" validate:"required"`
}

// ==================== Response ==========================

type LevelCaseSortResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseSort(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelCaseSortRequest{}, helper.ParseOptions{Body: true, Params: true})
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

	err = api.Service.LevelCaseSort(&LevelSortInput{
		Roles:                roles,
		SubjectId:            subjectId,
		LevelCaseSortRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelCaseSortResponse{
		StatusCode: http.StatusOK,
		Message:    "Levels sorted",
	})
}

// ==================== Service ==========================

type LevelSortInput struct {
	Roles     []int
	SubjectId string
	*LevelCaseSortRequest
}

func (service *serviceStruct) LevelCaseSort(in *LevelSortInput) error {
	curriculumGroupId, err := service.academicLevelStorage.SubLessonCaseGetCurriculumGroupId(in.SubLessonId)
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

	err = service.academicLevelStorage.LevelCaseSort(tx, in.Levels, in.SubLessonId)
	if err != nil {
		return err
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, []int{in.SubLessonId}, false, in.SubjectId)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
