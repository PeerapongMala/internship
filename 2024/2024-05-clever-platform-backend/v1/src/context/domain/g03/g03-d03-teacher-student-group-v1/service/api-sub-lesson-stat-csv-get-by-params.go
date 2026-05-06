package service

import (
	"bytes"
	"fmt"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) SubLessonStatCsvGetByParams(context *fiber.Ctx) error {
	var (
		in  constant.SubLessonStatFilter
		ok  bool
		err error
	)

	if err := context.QueryParser(&in); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	in.TeacherId, ok = context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studyGroupStr := context.Params("studyGroupId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	in.StudyGroupId, err = strconv.Atoi(studyGroupStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	lessonIdStr := context.Params("lessonId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	in.LessonId, err = strconv.Atoi(lessonIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	in.ParseDateTimeFilter(constant.DATE_FORMAT)
	in.Pagination = helper.PaginationNew(context)

	data, err := api.Service.SubLessonStatCsvGetByParams(in)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	context.Attachment("sub_lesson_stat_study_group.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) SubLessonStatCsvGetByParams(in constant.SubLessonStatFilter) ([]byte, error) {
	data, err := service.SubLessonStatListGetByParams(in)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.GroupSubLessonStatCsvHeader}
	for _, item := range data {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(item.SubLessonIndex),
			item.SubLessonName,
			fmt.Sprintf("%d-%d", item.LevelGruop.From, item.LevelGruop.To),
			fmt.Sprintf("%d/%d", item.TotalPassedLevel.Value, item.TotalPassedLevel.Total),
			fmt.Sprintf("%.2f/%d", item.TotalScore.Value, item.TotalScore.Total),
			fmt.Sprintf("%.2f", item.AverageTotalAttempt),
			fmt.Sprintf("%.2f", item.AverageTimeUsed),
			helper.FormatThaiDate(item.LastPlayedAt),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
