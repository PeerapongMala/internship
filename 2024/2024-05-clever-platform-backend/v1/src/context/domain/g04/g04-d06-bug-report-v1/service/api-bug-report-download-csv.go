package service

import (
	"bytes"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) BugReportDownloadCSV(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.BugFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	log.Printf("request: %+v", request)

	fileBytes, err := api.Service.BugReportDownloadCSV(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment(time.Now().UTC().Format(time.DateOnly) + "_Bugs.csv")

	return context.SendStream(reader)
}

// ==================== Service ==========================
func (service *serviceStruct) BugReportDownloadCSV(filter *constant.BugFilter) ([]byte, error) {
	bugs, err := service.bugReportStorage.BugList(filter, nil)
	if err != nil {
		return nil, err
	}

	//prepare csv data
	csvData := [][]string{constant.BugCSVHeader}
	for idx, bug := range bugs {
		csvData = append(csvData, []string{
			strconv.Itoa(idx + 1),
			strconv.Itoa(bug.BugID),
			bug.CreatedAt.Format(time.DateTime),
			bug.Platform,
			bug.Type,
			bug.Description,
			bug.Version,
			bug.CreatedBy,
			bug.Role,
			bug.Priority,
			bug.Status,
		})
	}

	//convert to csv
	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}
