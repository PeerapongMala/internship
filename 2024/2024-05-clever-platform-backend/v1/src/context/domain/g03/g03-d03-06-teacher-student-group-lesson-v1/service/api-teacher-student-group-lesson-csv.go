package service

import (
	"bytes"
	"fmt"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetLessonLevelStatCsv(ctx *fiber.Ctx) (err error) {

	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetLessonLevelStatListAndCsvParams{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(ctx, err)
	}

	teacherId, ok := ctx.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studyGroupStr := ctx.Params("studyGroupId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = in.ParseDateTimeFilter(constant.DateFormat)
	if err != nil {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.GetLessonLevelStatCsv(teacherId, in)
	if err != nil {
		var httpError helper.HttpError
		if errors.As(err, &httpError) {
			return helper.RespondHttpError(ctx, httpError)
		}
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	ctx.Attachment("lesson_stat_study_group.csv")

	return ctx.SendStream(reader)
}

// ==================== Service ==========================

func (service serviceStruct) GetLessonLevelStatCsv(teacherId string, in *constant.GetLessonLevelStatListAndCsvParams) (constant.GetLessonLevelStatCsvResult, error) {
	ents, err := service.storage.GetLessonLevelStatListByParams(in)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.GroupLessonStatCsvHeader}
	for i, ent := range ents {
		csvMapped = append(csvMapped, []string{
			fmt.Sprintf("%d", i+1),
			fmt.Sprintf("%d", ent.Index),
			ent.LessonName,
			ent.SubLessonName,
			ent.LevelType,
			ent.LevelQuestionType,
			ent.LevelDifficulty,
			fmt.Sprintf("%.f/%.f", float32(helper.Deref(ent.Score)), float32(helper.Deref(ent.TotalStudentPlayed)*constant.MaxStarPerLevel)),
			fmt.Sprintf("%d", helper.Deref(ent.TotalAttempt)),
			fmt.Sprintf("%f", helper.Deref(ent.AvgTimeUsed)),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
