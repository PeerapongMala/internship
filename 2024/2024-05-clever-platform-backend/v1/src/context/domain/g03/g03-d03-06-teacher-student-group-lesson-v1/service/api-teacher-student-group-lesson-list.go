package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetLessonLevelStatList(ctx *fiber.Ctx) (err error) {

	pagination := helper.PaginationNew(ctx)
	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetLessonLevelStatListAndCsvParams{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(ctx, err)
	}

	teacherId, ok := ctx.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = in.ParseDateTimeFilter(constant.DateFormat)
	if err != nil {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	in.Pagination = pagination
	result, err := api.Service.GetLessonLevelStatList(teacherId, in)
	if err != nil {
		var httpError helper.HttpError
		if errors.As(err, &httpError) {
			return helper.RespondHttpError(ctx, httpError)
		}
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return ctx.Status(http.StatusOK).JSON(constant.PaginationResponse{
		Pagination: pagination,
		Response: constant.Response{
			StatusCode: http.StatusOK,
			Data:       result,
			Message:    "Data retrieved",
		},
	})
}

// ==================== Service ==========================

func (service serviceStruct) GetLessonLevelStatList(teacherId string, in *constant.GetLessonLevelStatListAndCsvParams) (constant.GetLessonLevelStatListResult, error) {
	ents, err := service.storage.GetLessonLevelStatListByParams(in)
	if err != nil {
		return nil, err
	}

	data := make([]constant.LessonLevelStat, 0)
	for i, ent := range ents {
		data = append(data, constant.LessonLevelStat{
			Index:             i + 1,
			LessonName:        ent.LessonName,
			SubLessonName:     ent.SubLessonName,
			LevelIndex:        ent.Index,
			LevelType:         ent.LevelType,
			LevelQuestionType: ent.LevelQuestionType,
			LevelDifficulty:   ent.LevelDifficulty,
			AvgScorePerLevel: constant.ScoreStat{
				Score: float32(helper.Deref(ent.Score)),
				Total: float32(helper.Deref(ent.TotalStudentPlayed) * constant.MaxStarPerLevel),
			},
			TotalAttempt:    helper.Deref(ent.TotalAttempt),
			AverageTimeUsed: helper.Deref(ent.AvgTimeUsed),
		})
	}

	return data, nil
}
