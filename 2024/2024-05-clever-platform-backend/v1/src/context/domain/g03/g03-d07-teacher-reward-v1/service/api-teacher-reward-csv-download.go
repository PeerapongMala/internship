package service

import (
	"bytes"
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

func (api *APIStruct) TeacherRewardCsvDownload(context *fiber.Ctx) error {
	request := constant.CsvDowloadRequest{}

	limit := sql.NullInt64{
		Int64: 1000000,
		Valid: true,
	}
	pagination := &helper.Pagination{
		Page:   1,
		Limit:  limit,
		Offset: 0,
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	check := constant.CheckRoleRequest{
		SubjectId: subjectId,
		Roles:     roles,
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
	filter := constant.TeacherRewardListFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	fileBytes, err := api.Service.TeacherRewardCsvDownload(request, filter, check, pagination)
	if err != nil {

		return helper.RespondHttpError(context, err)
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("download.csv")

	return context.SendStream(reader)
}
func (service *serviceStruct) TeacherRewardCsvDownload(req constant.CsvDowloadRequest, filter constant.TeacherRewardListFilter, Role constant.CheckRoleRequest, pagination *helper.Pagination) ([]byte, error) {
	response, err := service.teacherRewardStorage.TeacherRewardList(Role.SubjectId, filter, pagination)
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
	Data := [][]string{constant.TeacherRewardCsvHeader}
	//for i, item := range response {
	//	Data = append(Data, []string{
	//		strconv.Itoa(i + 1),
	//		strconv.Itoa(item.Id),
	//		item.SubjectName,
	//		item.StudentName,
	//		item.StudentLastName,
	//		item.Year,
	//		item.ClassName,
	//		item.ItemName,
	//		strconv.Itoa(item.Amount),
	//	})
	//}
	dataBytes, err := helper.WriteCSV(Data, nil)
	if err != nil {
		return nil, err
	}
	return dataBytes, nil
}
