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

type UploadContentCSVRequest struct {
	constant.UploadCSVRequest
	CurriculumGroupId int `form:"curriculum_group_id" validate:"required"`
}

func (api *APIStruct) ContentUploadCSV(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &UploadContentCSVRequest{})
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
	filter := constant.LearningAreaFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.ContentUploadCSV(request, filter)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) ContentUploadCSV(req *UploadContentCSVRequest, filter constant.LearningAreaFilter) error {

	learningAreaData, _, err := service.repositoryStorage.GetLearningArea(req.CurriculumGroupId, filter, &constant.PaginationDefault)
	if err != nil {
		return err
	}

	mappingLearningAreaIdtoName := map[int]string{}
	mappingLearningAreaIdtoCurriculumGroupId := map[int]int{}
	for _, v := range learningAreaData {
		mappingLearningAreaIdtoName[v.Id] = v.Name
		mappingLearningAreaIdtoCurriculumGroupId[v.Id] = v.CurriculumGroupId
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
		row3 := record[3] //ชื่อสาระ
		row4 := record[4] //สถานะ

		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}

		//map curriculumGroupIdId to learningAreaId
		var learningAreaId int
		for laId, cgId := range mappingLearningAreaIdtoCurriculumGroupId {
			if cgId == req.CurriculumGroupId && mappingLearningAreaIdtoName[laId] == row2 {
				learningAreaId = laId
				break
			}
		}

		if learningAreaId == 0 {
			return errors.Errorf("CSVFile RowNo: %s is error by can't fint learningArea", record[0])
		}

		//prepare Struct to save
		if id != 0 {
			//update
			learningAreaEntity := constant.ContentUpdateRequest{
				Id:             id,
				LearningAreaId: learningAreaId,
				Name:           row3,
				Status:         row4,
				UpdatedBy:      req.SubjectId,
			}
			err = service.repositoryStorage.ContentUpdate(learningAreaEntity, tx)
		} else {
			//create
			learningAreaEntity := constant.ContentCreateRequest{
				LearningAreaId: learningAreaId,
				Name:           row3,
				Status:         row4,
				CreatedBy:      req.SubjectId,
			}
			err = service.repositoryStorage.ContentCreate(learningAreaEntity, tx)
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

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.ContentCSVHeader)
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
