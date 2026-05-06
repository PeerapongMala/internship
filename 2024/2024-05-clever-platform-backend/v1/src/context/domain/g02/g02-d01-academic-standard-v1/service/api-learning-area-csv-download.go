package service

import (
	"bytes"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"

	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

// ==================== Request ==========================

type DownloadLearningAreaCSVRequest struct {
	constant.DownloadCSVRequest
	CurriculumGroupId int `query:"curriculum_group_id"`
}

func (api *APIStruct) LearningAreaDownloadCSV(context *fiber.Ctx) error {

	request := &DownloadLearningAreaCSVRequest{}
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

	if request.CurriculumGroupId == 0 {
		textMsg := "curriculum_group_id is required"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &textMsg))
	}
	filter := constant.LearningAreaFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	fileBytes, err := api.Service.LearningAreaDownloadCSV(request, filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("download.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) LearningAreaDownloadCSV(req *DownloadLearningAreaCSVRequest, filter constant.LearningAreaFilter) ([]byte, error) {

	response, _, err := service.repositoryStorage.GetLearningArea(req.CurriculumGroupId, filter, &constant.PaginationDefault)
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
	csvData := [][]string{constant.LearningAreaCSVHeader}
	for i, item := range response {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(item.Id),
			item.Name,
			strconv.Itoa(item.YearId),
			item.SeedYearName,
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
