package service

import (
	"bytes"
	"fmt"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) StudentLevelStatCsvGetByStudentIdAndSubLessonId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subLessonIdStr := context.Params("subLessonId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subLessonId, err := strconv.Atoi(subLessonIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	var filter constant.SubLessonStatFilter
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	if err := filter.DateFilterBase.ParseDateTimeFilter(constant.DATE_FORMAT); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.StudentLevelStatCsvGetByStudentIdAndSubLessonId(studentId, subLessonId, filter)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	context.Attachment("lesson_stat.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) StudentLevelStatCsvGetByStudentIdAndSubLessonId(studentId string, subLessonId int, filter constant.SubLessonStatFilter) ([]byte, error) {
	data, err := service.StudentLevelStatListGetByStudentIdAndSubLessonId(studentId, subLessonId, filter)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.StudentSubLessonCsvHeader}
	for index, item := range data {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(index + 1),
			strconv.Itoa(item.LevelIndex),
			item.LevelType,
			item.QuestionType,
			item.Difficulty,
			fmt.Sprintf("%.0f/%d", item.TotalScore.Value, item.TotalScore.Total),
			strconv.Itoa(item.TotalAttempt),
			fmt.Sprintf("%.2f", item.AverageTimeUsed),
			helper.FormatThaiDate(item.LastPlayedAt, true),
		})
	}

	return helper.WriteCSV(csvMapped, nil)

}
