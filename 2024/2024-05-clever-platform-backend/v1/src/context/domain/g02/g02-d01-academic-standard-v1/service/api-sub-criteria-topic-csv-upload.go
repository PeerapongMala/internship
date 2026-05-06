package service

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type RequestSCT struct {
	constant.CSVUploadRequestSCT
	constant.IndicatorsFilter
	SubcriteriaId int
}

func (api *APIStruct) SubCriteriaTopicUploadCSV(context *fiber.Ctx) error {
	var limit = sql.NullInt64{
		Int64: 1000000,
		Valid: true,
	}
	pagination := helper.Pagination{
		Page:       1,
		Limit:      limit,
		TotalCount: 0,
	}
	subCriteriaId, err := context.ParamsInt("subCriteriaId")
	if err != nil {
		msg := "SubCriteria Id should be valid integer"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}
	request, err := helper.ParseAndValidateRequest(context, &RequestSCT{})
	if err != nil {
		msg := "Parse and validate request error"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		msg := "CSVFILE bad request"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	adminLoginAs := context.FormValue("admin_login_as")

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, err)
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.Roles = roles
	request.Csvfile = csvFile
	request.SubjectId = subjectId
	request.SubcriteriaId = subCriteriaId

	if adminLoginAs != "" {
		request.AdminLoginAs = &adminLoginAs
	}

	err = api.Service.SubCriteriaTopicUploadCSV(request, &pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) SubCriteriaTopicUploadCSV(req *RequestSCT, pagination *helper.Pagination) error {
	curriculumGroupId, err := service.repositoryStorage.GetBySubCriteriaId(req.SubcriteriaId)
	if err != nil {
		return err

	}
	check := false
	for _, role := range req.Roles {
		if role == int(userConstant.Admin) {
			check = true
			break
		}
	}
	if !check {
		_, err := service.repositoryStorage.CheckContentCreator(curriculumGroupId, req.SubjectId)

		if err != nil {
			if err.Error() == "user not allowed" {
				return fmt.Errorf("user not allowed")
			}
			return err

		}
	}
	yearData, err := service.repositoryStorage.YearList()
	if err != nil {
		return err
	}

	indicatorData, _, err := service.repositoryStorage.GetIndicators(curriculumGroupId, req.IndicatorsFilter, pagination)
	mappingYear := map[int]string{}
	for _, v := range yearData {
		mappingYear[v.Id] = v.SeedYearShortName
	}
	mappingIndicatorIdToName := map[int]string{}
	for _, v := range indicatorData {
		mappingIndicatorIdToName[v.Id] = v.Name
	}

	tx, err := service.repositoryStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //ID(ห้ามแก้)
		row2 := record[2] //ชื่อตัวชี้วัด
		row3 := record[3] //ชั้นปี(ย่อ)
		row4 := record[4] //ชื่อย่อ
		row5 := record[5] //ชื่อหัวข้อมตรฐานย่อย
		row6 := record[6] //สถานะ
		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}

		var yearId int
		for yid, yname := range mappingYear {
			if row3 == yname {
				yearId = yid

				break
			}
		}
		if yearId == 0 {

			return errors.Errorf("CSVFile RowNo : %s is error by year name is not match", row2)
		}

		var indicatorId int
		for iId, iName := range mappingIndicatorIdToName {
			if row2 == iName {

				indicatorId = iId
				break
			}
		}

		if id != 0 {

			err = service.repositoryStorage.SubCriteriaTopicUpdate(constant.SubCriteriaTopicsUpdateRequest{
				Id:            id,
				IndicatorId:   indicatorId,
				Name:          row5,
				ShortName:     row4,
				Status:        row6,
				UpdatedBy:     req.SubjectId,
				SubCriteriaId: req.SubcriteriaId,
				YearId:        yearId,
			}, tx)
		} else {

			err = service.repositoryStorage.SubCriteriaTopicCreate(constant.SubCriteriaTopicsCreateRequest{
				IndicatorId:   1,
				Name:          row5,
				ShortName:     row4,
				Status:        row6,
				CreatedBy:     req.SubjectId,
				SubCriteriaId: req.SubcriteriaId,
				YearId:        yearId,
			}, tx)
		}

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
		}

		return nil
	}

	file, err := req.Csvfile.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.SubCriteriaTopicCSVHeader)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
