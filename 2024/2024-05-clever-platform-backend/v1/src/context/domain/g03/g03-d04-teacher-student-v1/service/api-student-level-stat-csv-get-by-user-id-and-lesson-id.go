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

func (api *APIStruct) StudentLevelStatCsvGetByStudentIdAndLessonId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	lessonIdStr := context.Params("lessonId")
	if lessonIdStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	lessonId, err := strconv.Atoi(lessonIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	var filter constant.LessonStatFilter
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	if err := filter.DateFilterBase.ParseDateTimeFilter(constant.DATE_FORMAT); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	filter.Pagination = helper.PaginationNew(context)
	data, err := api.Service.StudentLevelStatCsvGetByStudentIdAndLessonId(studentId, lessonId, filter)
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

func (service *serviceStruct) StudentLevelStatCsvGetByStudentIdAndLessonId(studentId string, lessonId int, filter constant.LessonStatFilter) ([]byte, error) {
	data, err := service.StudentLevelStatListGetByStudentIdAndLessonId(studentId, lessonId, filter)
	if err != nil {
		return nil, err
	}
	csvMapped := [][]string{constant.StudentLessonCsvHeader}
	for _, item := range data {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(item.SubLessonIndex),
			item.SubLessonName,
			fmt.Sprintf("%d-%d", item.LevelGruop.From, item.LevelGruop.To),
			fmt.Sprintf("%.0f/%d", item.TotalPassedLevel.Value, item.TotalPassedLevel.Total),
			fmt.Sprintf("%.0f/%d", item.TotalScore.Value, item.TotalScore.Total),
			strconv.Itoa(item.TotalAttempt),
			fmt.Sprintf("%.2f", item.AverageTimeUsed),
			helper.FormatThaiDate(item.LastPlayedAt, true),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
