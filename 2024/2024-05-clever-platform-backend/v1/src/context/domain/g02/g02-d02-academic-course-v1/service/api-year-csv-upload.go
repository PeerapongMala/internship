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

type UploadYearCSVRequest struct {
	constant.UploadCSVRequest
	PlatformId int
}

func (api *APIStruct) YearUploadCSV(context *fiber.Ctx) error {

	request := &UploadYearCSVRequest{}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	platformId, err := context.ParamsInt("platformId")
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
	request.PlatformId = platformId
	if adminLoginAs != "" {
		request.AdminLoginAs = &adminLoginAs
	}

	err = api.Service.YearUploadCSV(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) YearUploadCSV(req *UploadYearCSVRequest) error {
	platform, err := service.academicCourseStorage.PlatformGet(req.PlatformId)
	if err != nil {
		return err
	}

	//prepare seedYear to mapping
	seedYears, err := service.academicCourseStorage.SeedYearList(&constant.PaginationDefault)
	if err != nil {
		return err
	}

	mappingNameSeedYear := map[string]int{}
	mappingNicknameSeedYear := map[string]int{}
	for _, v := range seedYears {
		mappingNameSeedYear[v.Name] = v.Id
		mappingNicknameSeedYear[v.ShortName] = v.Id
	}

	tx, err := service.academicCourseStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //Id
		row2 := record[2] //รหัสชั้นปี
		row3 := record[3] //ชื่อชั้นปี
		row4 := record[4] //ชื่อย่อ
		row5 := record[5] //สถานะ

		//validate Status
		err := constant.ValidateStatus(row5)
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

		seedYearId, err := strconv.Atoi(row2)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
		}

		seedYearIdFromDB, ok := mappingNameSeedYear[row3]
		if !ok {
			return errors.Errorf("CSVFile RowNo: %s is error by yearId not match", record[0])
		}

		seedYearIdFromDB2, ok := mappingNicknameSeedYear[row4]
		if !ok {
			return errors.Errorf("CSVFile RowNo: %s is error by yearId not match", record[0])
		}

		if seedYearId != seedYearIdFromDB || seedYearId != seedYearIdFromDB2 {
			return errors.Errorf("CSVFile RowNo: %s is error by yearId not match", record[0])
		}

		//prepare Struct to save
		now := time.Now().UTC()
		yearEntity := constant.YearEntity{
			Id:                id,
			CurriculumGroupId: platform.CurriculumGroupId,
			PlatformId:        platform.Id,
			SeedYearId:        seedYearId,
			Status:            row5,
			CreatedAt:         now,
			CreatedBy:         req.SubjectId,
			UpdatedBy:         &req.SubjectId,
			UpdatedAt:         &now,
			AdminLoginAs:      req.AdminLoginAs,
		}

		if id != 0 {
			//update
			_, err = service.academicCourseStorage.YearUpdate(tx, &yearEntity)
		} else {
			//create
			_, err = service.academicCourseStorage.YearCreate(nil, &yearEntity)
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

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.YearCSVHeader)
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
