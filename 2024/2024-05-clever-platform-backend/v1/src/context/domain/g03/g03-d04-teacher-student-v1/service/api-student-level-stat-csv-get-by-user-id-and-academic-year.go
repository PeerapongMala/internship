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

func (api *APIStruct) StudentLevelStatCsvGetByStudentIdAndAcademicYear(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	academicYearStr := context.Params("academicYear")
	if academicYearStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	academicYear, err := strconv.Atoi(academicYearStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	var filter constant.StudentAcademicYearStatFilter
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.StudentLevelStatCsvGetByStudentIdAndAcademicYear(studentId, academicYear, filter)
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
func (service *serviceStruct) StudentLevelStatCsvGetByStudentIdAndAcademicYear(studentId string, academicYear int, filter constant.StudentAcademicYearStatFilter) ([]byte, error) {
	data, err := service.StudentLevelStatListGetByStudentIdAndAcademicYear(studentId, academicYear, filter)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.StudentAcademicYearCsvHeader}
	for index, item := range data {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(index + 1),
			strconv.Itoa(item.AcademicYear),
			item.ClassYear,
			item.ClassName,
			item.CurriculumGroupShortName,
			item.SubjectName,
			item.LessonName,
			fmt.Sprintf("%.0f/%d", item.TotalPassedLevel.Value, item.TotalPassedLevel.Total),
			fmt.Sprintf("%.0f/%d", item.TotalScore.Value, item.TotalScore.Total),
			strconv.Itoa(item.TotalAttempt),
			fmt.Sprintf("%.2f", item.AverageTimeUsed),
			helper.FormatThaiDate(item.LastPlayedAt, true),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
