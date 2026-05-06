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

type UploadSubjectCSVRequest struct {
	constant.UploadCSVRequest
	SubjectGroupId int
}

func (api *APIStruct) SubjectUploadCSV(context *fiber.Ctx) error {

	request := &UploadSubjectCSVRequest{}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectGroupId, err := context.ParamsInt("subjectGroupId")
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
	request.SubjectGroupId = subjectGroupId
	if adminLoginAs != "" {
		request.AdminLoginAs = &adminLoginAs
	}

	err = api.Service.SubjectUploadCSV(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) SubjectUploadCSV(req *UploadSubjectCSVRequest) error {

	//query for get yearId
	yearId, err := service.academicCourseStorage.GetYearIdBySubjectGroupId(req.SubjectGroupId)
	if err != nil {
		return err
	}

	subjectGroups, err := service.academicCourseStorage.SubjectGroupList(yearId, nil, &constant.PaginationDefault)
	if err != nil {
		return err
	}

	mappingSubjectGroup := map[string]int{}
	for _, v := range subjectGroups {
		value := v
		mappingSubjectGroup[value.SubjectGroupName] = v.Id
	}

	tx, err := service.academicCourseStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	//var SubjectCSVHeader = []string{"No", "Id(ห้ามแก้)", "รหัสหลักสูตร", "กลุ่มวิชา", "วิชา", "ชนิดของภาษา", "ภาษา", "แพลตฟอร์ม", "สถานะ"}
	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //Id
		row2 := record[2] //รหัสหลักสูตร
		row3 := record[3] //กลุ่มวิชา
		row4 := record[4] //วิชา
		row5 := record[5] //ชนิดของภาษา
		row6 := record[6] //ภาษา
		row7 := record[7] //แพลตฟอร์ม
		row8 := record[8] //สถานะ

		//validate Status
		err := constant.ValidateStatus(row8)
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

		subjectGroupId, err := strconv.Atoi(row2)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
		}

		subjectGroupFromDB, ok := mappingSubjectGroup[row3]
		if !ok {
			return errors.Errorf("CSVFile RowNo: %s is error by subjectGroupId not match", record[0])
		}

		if subjectGroupId != subjectGroupFromDB {
			return errors.Errorf("CSVFile RowNo: %s is error by subjectGroupId not match", record[0])
		}

		//prepare Struct to save
		now := time.Now().UTC()
		subjectEntity := constant.SubjectEntity{
			Id:                  id,
			SubjectGroupId:      req.SubjectGroupId,
			Name:                row4,
			Project:             helper.HandleStringToPointer(row7),
			SubjectLanguageType: row5,
			SubjectLanguage:     helper.HandleStringToPointer(row6),
			Status:              row8,
			CreatedAt:           now,
			CreatedBy:           req.SubjectId,
			UpdatedBy:           &req.SubjectId,
			UpdatedAt:           &now,
			AdminLoginAs:        req.AdminLoginAs,
		}

		if id != 0 {
			//update
			_, err = service.academicCourseStorage.SubjectUpdate(tx, &subjectEntity)
			if err != nil {
				return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
			}
		} else {
			//create
			subject, err := service.academicCourseStorage.SubjectCreate(tx, &subjectEntity)
			if err != nil {
				return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
			}

			err = service.academicCourseStorage.SubjectPrefill(tx, req.SubjectGroupId, subject.Id)
			if err != nil {
				return err
			}
		}

		return nil
	}

	file, err := req.Csvfile.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.SubjectCSVHeader)
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
