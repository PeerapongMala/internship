package service

import (
	"bytes"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverDownloadCSV(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	fileBytes, err := api.Service.ObserverDownloadCSV(&constant.DownloadCSVInput{
		Pagination: pagination,
	})
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("g01d07-observer.csv")

	return context.SendStream(reader)
}

// ==================== Service ==========================

func (service *serviceStruct) ObserverDownloadCSV(in *constant.DownloadCSVInput) ([]byte, error) {
	filter := constant.ObserverFilter{}
	observers, err := service.adminUserAccountStorage.ObserverList(in.Pagination, &filter)
	if err != nil {
		return nil, err
	}

	//prepare csv data
	csvData := [][]string{constant.ObserverCSVHeader}

	for idx, observer := range observers {
		var roles []int
		for _, role := range observer.ObserverAccesses {
			roles = append(roles, role.ObserverAccessId)
		}
		csvData = append(csvData, []string{
			strconv.Itoa(idx + 1),
			observer.Id,
			observer.Title,
			observer.FirstName,
			observer.LastName,
			*observer.Email,
			"", // Password
			observer.Status,
			strings.Trim(strings.Replace(fmt.Sprint(roles), " ", ",", -1), "[]"), // Accesses
		})
	}

	//convert to csv
	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}
