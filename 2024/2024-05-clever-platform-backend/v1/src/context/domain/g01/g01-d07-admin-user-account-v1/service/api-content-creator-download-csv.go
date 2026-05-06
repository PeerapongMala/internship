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

func (api *APIStruct) ContentCreatorDownloadCSV(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	fileBytes, err := api.Service.ContentCreatorDownloadCSV(&constant.DownloadCSVInput{
		Pagination: pagination,
	})
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("g01d07-content-creator.csv")

	return context.SendStream(reader)
}

// ==================== Service ==========================

func (service *serviceStruct) ContentCreatorDownloadCSV(in *constant.DownloadCSVInput) ([]byte, error) {
	filter := constant.UserFilter{
		Roles: []int{int(constant.ContentCreator)},
	}
	users, err := service.adminUserAccountStorage.UserList(&filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	//prepare csv data
	csvData := [][]string{constant.ContentCreatorCSVHeader}
	for idx, user := range users {
		csvData = append(csvData, []string{
			strconv.Itoa(idx + 1),
			user.UserEntity.Id,
			user.UserEntity.Title,
			user.UserEntity.FirstName,
			user.UserEntity.LastName,
			*user.UserEntity.Email,
			"", // Password
			user.UserEntity.Status,
		})
	}

	//convert to csv
	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}
