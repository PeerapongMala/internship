package service

import (
	"bytes"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"

	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

	"github.com/pkg/errors"
)

// ==================== Request ==========================

type DownloadYearCSVRequest struct {
	constant.DownloadCSVRequest
	PlatformId int
}

func (api *APIStruct) YearDownloadCSV(context *fiber.Ctx) error {

	request := &DownloadYearCSVRequest{}
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

	platformId, err := context.ParamsInt("platformId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.PlatformId = platformId

	fileBytes, err := api.Service.YearDownloadCSV(request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("download.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) YearDownloadCSV(req *DownloadYearCSVRequest) ([]byte, error) {

	response, err := service.academicCourseStorage.YearList(req.PlatformId, nil, &constant.PaginationDefault)
	if err != nil {
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

	//filter by date
	response, err = helper.FilterStructWithDate(*startTime, *endTime, response, "CreatedAt")
	if err != nil {
		return nil, err
	}

	//prepare csv data
	// var YearCSVHeader = []string{"No", "Id(ห้ามแก้)", "รหัสชั้นปี", "ชื่อชั้นปี", "ชื่อย่อ", "สถานะ"}
	csvData := [][]string{constant.YearCSVHeader}
	for i, item := range response {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(item.Id),
			strconv.Itoa(item.SeedYearId),
			item.SeedYearName,
			item.SeedYearShortName,
			item.Status,
		})
	}

	//convert to csv
	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}
