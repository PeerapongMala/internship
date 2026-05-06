package service

import (
	"log"
	"net/http"
	"strconv"

	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================

type UploadLearningAreaCSVRequest struct {
	constant.UploadCSVRequest
	CurriculumGroupId int `form:"curriculum_group_id" validate:"required"`
}

func (api *APIStruct) LearningAreaUploadCSV(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &UploadLearningAreaCSVRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	adminLoginAs := context.FormValue("admin_login_as")

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, err)
	}

	request.Csvfile = csvFile
	request.SubjectId = subjectId

	if adminLoginAs != "" {
		request.AdminLoginAs = &adminLoginAs
	}

	err = api.Service.LearningAreaUploadCSV(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) LearningAreaUploadCSV(req *UploadLearningAreaCSVRequest) error {

	//prepare SeedSubjectGroup to mapping
	yearData, err := service.repositoryStorage.YearList()
	if err != nil {
		return err
	}

	mappingYear := map[int]string{}
	for _, v := range yearData {
		mappingYear[v.Id] = v.SeedYearShortName
	}

	tx, err := service.repositoryStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //Id(ห้ามแก้)
		row2 := record[2] //ชื่อกลุ่มสาระการเรียนรู้
		row3 := record[3] //รหัสชั้นปี
		row4 := record[4] //ชั้นปี
		row5 := record[5] //สถานะ

		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}

		yearId, err := strconv.Atoi(row3)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
		}

		yearNameFromDB, ok := mappingYear[yearId]
		if !ok {
			return errors.Errorf("CSVFile RowNo: %s is error by yearId not match", record[0])
		}

		if row4 != yearNameFromDB {
			return errors.Errorf("CSVFile RowNo: %s is error by yearId not match", record[0])
		}

		//prepare Struct to save
		if id != 0 {
			//update
			learningAreaEntity := constant.LearningAreaUpdateRequest{
				Id:                id,
				CurriculumGroupId: req.CurriculumGroupId,
				YearId:            yearId,
				LearningAreaName:  row2,
				Status:            row5,
				UpdatedBy:         req.SubjectId,
			}
			err = service.repositoryStorage.LearningAreaUpdate(learningAreaEntity, tx)
		} else {
			//create
			learningAreaEntity := constant.LearningAreaCreateRequest{
				CurriculumGroupId: req.CurriculumGroupId,
				YearId:            yearId,
				LearningAreaName:  row2,
				Status:            row5,
				CreatedBy:         req.SubjectId,
			}
			err = service.repositoryStorage.LearningAreaCreate(learningAreaEntity, tx)
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

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.LearningAreaCSVHeader)
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
