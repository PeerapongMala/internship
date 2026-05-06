package service

import (
	"bytes"
	"fmt"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) LessonStatAcademicYearCsvGet(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	filter := constant.LessonStatAcademicYearListFilter{}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LessonStatAcademicYearListGetRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.GetLessonStatsCsvByTeacherAndYear(teacherId, request.AcademicYear, filter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	context.Attachment("lesson_stat.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) GetLessonStatsCsvByTeacherAndYear(
	teacherId string,
	academicYear int,
	filter constant.LessonStatAcademicYearListFilter,
	pagination *helper.Pagination,
) ([]byte, error) {

	data, err := service.GetLessonStatsByTeacherAndYear(teacherId, academicYear, filter, pagination)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.LessonStatCsvHeader}
	for index, item := range data {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(index + 1),
			item.Student.Id,
			item.Student.Title,
			item.Student.FirstName,
			item.Student.LastName,
			strconv.Itoa(item.Class.AcademicYear),
			item.Class.Year,
			item.Class.Name,
			fmt.Sprintf("%d/%d", item.LevelPassed.Value, item.LevelPassed.Total),
			fmt.Sprintf("%d/%d", item.TotalScore.Value, item.TotalScore.Total),
			strconv.Itoa(item.TotalAttempt),
			fmt.Sprintf("%.2f", item.AvgTimeUsed),
			helper.FormatThaiDate(item.Student.LastLogin),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
