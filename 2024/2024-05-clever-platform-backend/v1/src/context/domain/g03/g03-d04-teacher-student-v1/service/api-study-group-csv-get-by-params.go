package service

import (
	"bytes"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) StudyGroupCsvGetByParams(context *fiber.Ctx) error {

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

	filter := constant.StudyGroupFilter{
		Student: constant.StudentParam{
			StudentId: studentId,
		},
		AcademicYear: academicYear,
	}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.StudyGroupCsvGetByParams(filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	context.Attachment("lesson_stat.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) StudyGroupCsvGetByParams(filter constant.StudyGroupFilter) ([]byte, error) {
	data, err := service.StudyGroupListGetByParams(filter)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.StudyGroupCsvHeader}
	for index, item := range data {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(index + 1),
			item.StudyGroupName,
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
