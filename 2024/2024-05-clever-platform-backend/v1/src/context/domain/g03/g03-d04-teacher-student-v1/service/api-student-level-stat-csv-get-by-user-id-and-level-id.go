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

func (api *APIStruct) StudentLevelStatCsvGetByStudentIdAndLevelId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	levelIdStr := context.Params("levelId")
	if levelIdStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	levelId, err := strconv.Atoi(levelIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.StudentLevelStatCsvGetByStudentIdAndLevelId(studentId, levelId, nil)
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

func (service *serviceStruct) StudentLevelStatCsvGetByStudentIdAndLevelId(studentId string, levelId int, pagination *helper.Pagination) ([]byte, error) {
	data, err := service.StudentLevelStatListGetByStudentIdAndLevelId(studentId, levelId, pagination)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.StudentLevelCsvHeader}
	for index, item := range data {
		csvMapped = append(csvMapped, []string{
			strconv.Itoa(index + 1),
			strconv.Itoa(item.PlaySequence),
			strconv.Itoa(item.Score),
			fmt.Sprintf("%.2f", item.AverageTimeUsed),
			helper.FormatThaiDate(&item.PlayedAt, true),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
