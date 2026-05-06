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

type DownloadSubjectCSVRequest struct {
	constant.DownloadCSVRequest
	SubjectGroupId int
}

func (api *APIStruct) SubjectDownloadCSV(context *fiber.Ctx) error {

	request := &DownloadSubjectCSVRequest{}
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

	subjectGroupId, err := context.ParamsInt("subjectGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.SubjectGroupId = subjectGroupId

	fileBytes, err := api.Service.SubjectDownloadCSV(request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("download.csv")

	return context.SendStream(reader)
}

func (service *serviceStruct) SubjectDownloadCSV(req *DownloadSubjectCSVRequest) ([]byte, error) {

	filter := constant.SubjectFilter{
		SubjectGroupId: req.SubjectGroupId,
	}

	response, err := service.academicCourseStorage.SubjectList(&filter, &constant.PaginationDefault)
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
	//var SubjectCSVHeader = []string{"No", "Id(ห้ามแก้)", "รหัสหลักสูตร", "กลุ่มวิชา", "วิชา", "ชนิดของภาษา", "ภาษา", "แพลตฟอร์ม", "สถานะ"}
	csvData := [][]string{constant.SubjectCSVHeader}
	for i, item := range response {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(item.Id),
			strconv.Itoa(item.SubjectGroupId),
			item.SeedSubjectGroupName,
			item.Name,
			item.SubjectLanguageType,
			helper.HandleStringPointerField(item.SubjectLanguage),
			helper.HandleStringPointerField(item.Project),
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
