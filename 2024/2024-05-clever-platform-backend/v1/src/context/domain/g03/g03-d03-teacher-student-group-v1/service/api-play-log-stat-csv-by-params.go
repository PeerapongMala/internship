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

func (api *APIStruct) PlayLogStatCsvGetByParams(context *fiber.Ctx) error {
	var (
		in  constant.PlayLogStatFilter
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

	in.ParseDateTimeFilter(constant.DATE_FORMAT)

	data, err := api.Service.PlayLogStatCsvGetByParams(in)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	context.Attachment("play_log_stat_study_group.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) PlayLogStatCsvGetByParams(in constant.PlayLogStatFilter) ([]byte, error) {
	data, err := service.PlayLogStatListGetByParams(in)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.GroupPlayLogStatCsvHeader}
	for _, item := range data {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(item.StudentIndex),
			fmt.Sprintf("%d", item.StudentId),
			item.StudentTitle,
			item.StudentFirstName,
			item.StudentLastName,
			fmt.Sprintf("%d/%d", item.TotalPassedLevel.Value, item.TotalPassedLevel.Total),
			fmt.Sprintf("%.f/%d", item.TotalScore.Value, item.TotalScore.Total),
			fmt.Sprintf("%d", item.TotalAttempt),
			fmt.Sprintf("%.2f", item.AverageTimeUsed),
			helper.FormatThaiDate(item.LastestLoginAt),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
