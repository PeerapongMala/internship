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

func (api *APIStruct) LessonStatListDownloadCsvGetByTeacherId(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	filter := constant.TeacherStudentListWithStatFilter{}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.TeacherStudentListWithStatDownloadCsvGetByTeacherId(teacherId, filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	context.Attachment("lesson_stat.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) TeacherStudentListWithStatDownloadCsvGetByTeacherId(teacherId string, filter constant.TeacherStudentListWithStatFilter) ([]byte, error) {
	studentList, err := service.repositoryTeacherStudent.TeacherStudentListWithStatByTeacherId(teacherId, filter, nil)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.LessonStatCsvHeader}
	for index, student := range studentList {
		var avgTime string
		if student.AvgTimeUsed != nil {
			avgTime = fmt.Sprintf("%.2f", *student.AvgTimeUsed)
		}

		csvMapped = append(csvMapped, []string{
			strconv.Itoa(index + 1),
			student.StudentId,
			student.StudentTitle,
			student.StudentFirstName,
			student.StudentLastName,
			strconv.Itoa(student.AcademicYear),
			student.ClassYear,
			student.ClassName,
			fmt.Sprintf("%d/%d", student.TotalPassedLevel, student.TotalLevel),
			fmt.Sprintf("%d/%d", student.TotalPassedStar, student.TotalStar),
			strconv.Itoa(student.TotalAttempt),
			avgTime,
			helper.FormatThaiDate(student.StudentLastLogin, true),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
