package service

import (
	"bytes"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) StudentListDownloadByTeacherId(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	filter := constant.StudentListByTeacherIdFilter{}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.StudentListDownloadByTeacherId(teacherId, filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	context.Attachment("student_list.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) StudentListDownloadByTeacherId(
	teacherId string,
	filter constant.StudentListByTeacherIdFilter,
) ([]byte, error) {
	studentList, err := service.StudentListByTeacherId(teacherId, nil, filter)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.StudentListCsvHeader}
	for index, student := range studentList {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(index + 1),
			student.StudentId,
			student.Title,
			student.FirstName,
			student.LastName,
			helper.HandleStringPointerField(student.Email),
			helper.FormatThaiDate(student.LastLogin),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
