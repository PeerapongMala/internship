package service

import (
	"bytes"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================

func (api *APIStruct) ParentDownloadCSV(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	fileBytes, err := api.Service.ParentDownloadCSV(&constant.DownloadCSVInput{
		Pagination: pagination,
	})
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("g01d07-parent.csv")

	return context.SendStream(reader)
}

// ==================== Service ==========================

type ParentDownloadCSVInput struct {
	Pagination *helper.Pagination
}

func (service *serviceStruct) ParentDownloadCSV(in *constant.DownloadCSVInput) ([]byte, error) {
	filter := constant.UserFilter{
		Roles: []int{int(constant.Parent)},
	}
	users, err := service.adminUserAccountStorage.ParentList(&filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	//prepare csv data
	csvData := [][]string{constant.ParentCSVHeader}
	for idx, user := range users {
		csvData = append(csvData, []string{
			strconv.Itoa(idx + 1),
			user.Id,
			user.Title,
			user.FirstName,
			user.LastName,
			*user.Email,
			user.Status,
			user.Relationship,
		})
	}

	//convert to csv
	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}
