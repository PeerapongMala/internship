package service

import (
	"bytes"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SubcriteriaCsvDowload(context *fiber.Ctx) error {
	request := &constant.CsvDowloadRequestsct{}
	SubCriteriaId, err := context.ParamsInt("subCriteriaId")
	if err != nil {
		textmsg := "SubCriteria ID should be valid integer"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &textmsg))
	}

	var limit = sql.NullInt64{
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
	check := constant.CheckAdmin{
		SubjectId: subjectId,
		Roles:     roles,
	}
	err = context.QueryParser(request)
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
	filter := constant.TopicsFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	fileBytes, err := api.Service.SubCriteriaTopicCsvDowload(check, SubCriteriaId, request.StartDate, request.EndDate, filter, pagination)
	if err != nil {
		if err.Error() == "user not allowed" {
			msg := "User isn't content creator of this curriculum group"
			return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusForbidden, &msg))
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(fileBytes)
	context.Attachment("download.csv")

	return context.SendStream(reader)
}
func (service *serviceStruct) SubCriteriaTopicCsvDowload(check constant.CheckAdmin, SubcriteriaId int, StartDate string, EndDate string, filter constant.TopicsFilter, pagination *helper.Pagination) ([]byte, error) {
	curriculumGroupId, err := service.repositoryStorage.GetBySubCriteriaId(SubcriteriaId)
	if err != nil {
		return nil, err
	}
	valid := false
	for _, role := range check.Roles {
		if role == int(userConstant.Admin) {
			valid = true
			break
		}
	}
	if !valid {
		_, err := service.repositoryStorage.CheckContentCreator(curriculumGroupId, check.SubjectId)

		if err != nil {
			if err.Error() == "user not allowed" {
				return nil, fmt.Errorf("user not allowed")
			}
			return nil, err

		}
	}
	response, _, err := service.repositoryStorage.GetTopic(SubcriteriaId, filter, pagination)
	if err != nil {
		return nil, err
	}
	startTime, err := helper.ConvertTimeStringToTime(StartDate)
	if err != nil {
		return nil, err
	}

	endTime, err := helper.ConvertTimeStringToTime(EndDate)
	if err != nil {
		return nil, err
	}

	response, err = helper.FilterStructWithDate(*startTime, *endTime, response, "CreatedAt")
	if err != nil {
		return nil, err
	}
	Data := [][]string{constant.SubCriteriaTopicCSVHeader}
	for i, item := range response {
		Data = append(Data, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(item.Id),
			item.IndicatorName,
			item.SeedYearName,
			item.ShortName,
			item.Name,
			item.Status,
		})
	}
	dataBytes, err := helper.WriteCSV(Data, nil)
	if err != nil {
		return nil, err
	}

	return dataBytes, nil
}
