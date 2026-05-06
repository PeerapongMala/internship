package service

import (
	"log"
	"net/http"
	"strconv"
	"time"

	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================

type UploadSubjectGroupCSVRequest struct {
	constant.UploadCSVRequest
	YearId int
}

func (api *APIStruct) SubjectGroupUploadCSV(context *fiber.Ctx) error {

	request := &UploadSubjectGroupCSVRequest{}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	yearId, err := context.ParamsInt("yearId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	adminLoginAs := context.FormValue("admin_login_as")

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, err)
	}

	request.Csvfile = csvFile
	request.SubjectId = subjectId
	request.YearId = yearId
	if adminLoginAs != "" {
		request.AdminLoginAs = &adminLoginAs
	}

	err = api.Service.SubjectGroupUploadCSV(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) SubjectGroupUploadCSV(req *UploadSubjectGroupCSVRequest) error {

	//prepare SeedSubjectGroup to mapping
	seedSubjectGroup, err := service.academicCourseStorage.SeedSubjectGroupList(&constant.PaginationDefault)
	if err != nil {
		return err
	}

	mappingNameSeedSubjectGroup := map[string]int{}
	for _, v := range seedSubjectGroup {
		mappingNameSeedSubjectGroup[v.Name] = v.Id
	}

	tx, err := service.academicCourseStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //Id
		row2 := record[2] //รหัสกลุ่มวิชา
		row3 := record[3] //ชื่อกลุ่มวิชา
		row4 := record[4] //สถานะ

		//validate Status
		err := constant.ValidateStatus(row4)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by invalid status", record[0])
		}

		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}

		seedSubjectGroupId, err := strconv.Atoi(row2)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
		}

		seedSubjectGroupFromDB, ok := mappingNameSeedSubjectGroup[row3]
		if !ok {
			return errors.Errorf("CSVFile RowNo: %s is error by seedSubjectGroupId not match", record[0])
		}

		if seedSubjectGroupId != seedSubjectGroupFromDB {
			return errors.Errorf("CSVFile RowNo: %s is error by seedSubjectGroupId not match", record[0])
		}

		//prepare Struct to save
		now := time.Now().UTC()
		subjectGroupEntity := constant.SubjectGroupEntity{
			Id:                   id,
			YearId:               req.YearId,
			SeedSubjectGroupName: row3,
			SeedSubjectGroupId:   seedSubjectGroupId,
			Status:               row4,
			CreatedAt:            now,
			CreatedBy:            req.SubjectId,
			UpdatedBy:            &req.SubjectId,
			UpdatedAt:            &now,
			AdminLoginAs:         req.AdminLoginAs,
		}

		if id != 0 {
			//update
			_, err = service.academicCourseStorage.SubjectGroupUpdate(tx, &subjectGroupEntity)
		} else {
			//create
			_, err = service.academicCourseStorage.SubjectGroupCreate(&subjectGroupEntity)
		}

		if err != nil {
			return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
		}

		return nil
	}

	file, err := req.Csvfile.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.SubjectGroupCSVHeader)
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
