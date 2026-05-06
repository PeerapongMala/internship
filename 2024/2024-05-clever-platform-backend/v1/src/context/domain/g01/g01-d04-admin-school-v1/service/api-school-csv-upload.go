package service

import (
	"fmt"
	"log"
	"net/http"
	"slices"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SchoolCsvUpload(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &constant.CSVUploadRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, err)
	}

	request.Pagination = pagination
	request.SubjectId = subjectId
	request.Csvfile = csvFile
	err = api.Service.SchoolCsvUpload(*request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}
func (service *serviceStruct) SchoolCsvUpload(req constant.CSVUploadRequest) error {
	tx, err := service.adminSchoolStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	callback := func(record []string) error {
		row0 := record[0] //NO
		row1 := record[1] //รหัสโรงเรียน(ห้ามแก้)
		row2 := record[2] //สังกัดโรงเรียน
		row3 := record[3] //ชื่อโรงเรียน
		row4 := record[4] //ที่อยู่
		row5 := record[5] //ภาค
		row6 := record[6] //จังหวัด
		row7 := record[7] //อำเภอ
		row8 := record[8] //ตำบล
		row9 := record[9] //รหัสไปรษณีย์
		row10 := record[10]
		row11 := record[11]
		row12 := record[12]
		row13 := record[13]
		row14 := record[14]
		row15 := record[15]
		row16 := record[16]
		row17 := record[17]
		row18 := record[18]
		row19 := record[19]
		row20 := record[20]
		row21 := record[21]

		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}
		var schoolAffiliationId *int
		if row2 != "" {
			schoolAffiliationId, err = service.adminSchoolStorage.SchoolAffiliationGetByName(row2)
			if err != nil || schoolAffiliationId == nil {
				return errors.Errorf("CSVFile RowNo: %s is error by can't find SchoolAffiliation name", record[0])
			}
		}

		// status
		if row20 == "" || !slices.Contains(constant.UserStatusList, constant.UserStatus(row20)) {
			msg := fmt.Sprintf("Invalid status")
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		// region
		if row5 != "" && !slices.Contains(constant.Regions, row5) {
			return helper.NewHttpError(http.StatusBadRequest, helper.ToPtr(fmt.Sprintf("Invalid region: %s", row5)))
		}

		// province
		if row6 != "" && !slices.Contains(constant.Provinces, row6) {
			return helper.NewHttpError(http.StatusBadRequest, helper.ToPtr(fmt.Sprintf("Invalid province: %s", row6)))
		}

		if id != 0 {
			req := constant.SchoolUpdateRequest{
				Id:                      id,
				Code:                    &row21,
				ImageUrl:                new(string),
				Name:                    row3,
				Address:                 row4,
				Region:                  row5,
				Province:                row6,
				District:                row7,
				SubDistrict:             row8,
				PostCode:                row9,
				Latitude:                &row10,
				Longtitude:              &row11,
				Director:                &row12,
				DirectorPhone:           &row13,
				Registrar:               &row14,
				RegistrarPhone:          &row15,
				AcademicAffairHead:      &row16,
				AcademicAffairHeadPhone: &row17,
				Advisor:                 &row18,
				AdvisorPhone:            &row19,
				Status:                  row20,
				UpdatedBy:               req.SubjectId,
			}
			if row2 != "" {
				req.SchoolAffiliationId = *schoolAffiliationId
			}

			err = service.adminSchoolStorage.SchoolUpdateCSV(req, tx)
			if err != nil {
				log.Printf("error : Update")
				log.Printf("%+v error:update", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
			}
		} else {
			req := constant.SchoolCreateRequest{
				Code:                    &row21,
				Name:                    row3,
				Address:                 row4,
				Region:                  row5,
				Province:                row6,
				District:                row7,
				SubDistrict:             row8,
				PostCode:                row9,
				Latitude:                &row10,
				Longtitude:              &row11,
				Director:                &row12,
				DirectorPhone:           &row13,
				Registrar:               &row14,
				RegistrarPhone:          &row15,
				AcademicAffairHead:      &row16,
				AcademicAffairHeadPhone: &row17,
				Advisor:                 &row18,
				AdvisorPhone:            &row19,
				Status:                  row20,
				CreatedBy:               req.SubjectId,
			}
			if row2 != "" {
				req.SchoolAffiliationId = *schoolAffiliationId
			}

			err = service.adminSchoolStorage.SchoolCreate(req, tx)
			if err != nil {
				log.Println(req.SchoolAffiliationId)
				log.Printf("error : Create")
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
			}
		}

		return nil
	}
	file, err := req.Csvfile.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.SchoolCSVHeader)
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
