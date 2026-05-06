package service

import (
	"bytes"
	"log"
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) TeacherAnnouncementCsvDownload(context *fiber.Ctx) error {
	request := constant.CsvDowloadRequest{}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err := context.QueryParser(&request)
	if err != nil {
		log.Print(err)
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

	filter := constant.TeacherAnnounceFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	fileBytes, err := api.Service.TeacherAnnounceCsvDownload(request, subjectId, filter)
	if err != nil {

		return helper.RespondHttpError(context, err)
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("download.csv")

	return context.SendStream(reader)
}
func (service *serviceStruct) TeacherAnnounceCsvDownload(req constant.CsvDowloadRequest, teacherId string, filter constant.TeacherAnnounceFilter) ([]byte, error) {
	pagination := helper.PaginationDefault()
	schoolId, err := service.TeacherannounceStorage.GetSchoolByUserId(teacherId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	response, _, err := service.TeacherannounceStorage.AnnouncementList(pagination, schoolId, filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
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
	Data := [][]string{constant.TeacherAnnounceCsvHeader}
	for i, item := range response {
		Data = append(Data, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(item.Id),
			item.SchoolName,
			item.Scope,
			item.Type,
			item.Title,
			item.Description,
			item.StartAt,
			item.EndAt,
			item.Status,
		})
	}

	dataBytes, err := helper.WriteCSV(Data, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}
