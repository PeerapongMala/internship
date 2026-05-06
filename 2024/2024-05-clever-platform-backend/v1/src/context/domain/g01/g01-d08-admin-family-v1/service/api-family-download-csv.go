package service

import (
	"bytes"
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) FamilyDownloadCSV(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.FamilyFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	fileBytes, err := api.Service.FamilyDownloadCSV(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("FamilyList.csv")

	return context.SendStream(reader)
}

// ==================== Service ==========================
func (service *serviceStruct) FamilyDownloadCSV(filter *constant.FamilyFilter) ([]byte, error) {
	families, err := service.adminFamilyStorage.FamilyList(filter, nil)
	if err != nil {
		return nil, err
	}

	//prepare csv data
	csvData := [][]string{constant.FamilyCSVHeader}
	for idx, family := range families {
		lineId := derefString(family.LineID)
		userID := derefString(family.UserID)
		firstName := derefString(family.FirstName)
		lastName := derefString(family.LastName)

		csvData = append(csvData, []string{
			strconv.Itoa(idx + 1),
			strconv.Itoa(family.FamilyID),
			userID,
			firstName,
			lastName,
			lineId,
			strconv.Itoa(family.Member),
			family.Status,
			family.CreatedAt.Format(time.DateTime),
		})
	}

	//convert to csv
	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}

func derefString(s *string) string {
	if s != nil {
		return *s
	}
	return ""
}
