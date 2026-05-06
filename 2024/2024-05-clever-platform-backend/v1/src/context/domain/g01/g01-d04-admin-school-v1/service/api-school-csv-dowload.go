package service

import (
	"bytes"
	"log"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type DownloadRequest struct {
	constant.CsvDowloadRequest
}

func (api *APIStruct) SchoolDownloadCSV(context *fiber.Ctx) error {

	request := &DownloadRequest{}
	err := context.QueryParser(request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if request.StartDate == "" {
		textMsg := "start_date is required"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &textMsg))
	}

	if request.EndDate == "" {
		textMsg := "end_date is required"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &textMsg))
	}

	fileBytes, err := api.Service.SchoolCsvDowload(request.CsvDowloadRequest)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("download.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) SchoolCsvDowload(req constant.CsvDowloadRequest) ([]byte, error) {
	response, err := service.adminSchoolStorage.SchoolListCsv()
	if err != nil {
		log.Print(err)
		return nil, err
	}

	startTime, err := helper.ConvertTimeStringToTime(req.StartDate)
	if err != nil {
		return nil, err
	}

	endTime, err := helper.ConvertTimeStringToTime(req.EndDate)
	if err != nil {
		return nil, err
	}

	response, err = helper.FilterStructWithDate(*startTime, *endTime, response, "CreatedAt")
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.SchoolCSVHeader}
	for i, item := range response {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(item.Id),
			helper.HandleStringPointerField(item.SchoolAffiliationName),
			item.Name,
			item.Address,
			item.Region,
			item.Province,
			item.District,
			item.SubDistrict,
			item.PostCode,
			checkNilStringPointer(item.Latitude),
			checkNilStringPointer(item.Longtitude),
			checkNilStringPointer(item.Director),
			checkNilStringPointer(item.DirectorPhone),
			checkNilStringPointer(item.Registrar),
			checkNilStringPointer(item.RegistrarPhone),
			checkNilStringPointer(item.AcademicAffairHead),
			checkNilStringPointer(item.AcademicAffairHeadPhone),
			checkNilStringPointer(item.Advisor),
			checkNilStringPointer(item.AdvisorPhone),
			item.Status,
			item.Code,
		})
	}

	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	return dataBytes, nil
}

func checkNilStringPointer(ptr *string) string {
	if ptr == nil {
		return "" //
	}
	return *ptr
}
