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

type UploadCriteriaCSVRequest struct {
	constant.UploadCSVRequest
	CurriculumGroupId int `form:"curriculum_group_id" validate:"required"`
}

func (api *APIStruct) CriteriaUploadCSV(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &UploadCriteriaCSVRequest{})
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
	filter := constant.ContentFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.CriteriaUploadCSV(request, filter)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) CriteriaUploadCSV(req *UploadCriteriaCSVRequest, filter constant.ContentFilter) error {

	contentData, _, err := service.repositoryStorage.GetContent(req.CurriculumGroupId, filter, &constant.PaginationDefault)
	if err != nil {
		return err
	}

	mappingContentIdToName := map[int]string{}
	mappingContentIdToCurriculumGroupId := map[int]int{}
	for _, v := range contentData {
		mappingContentIdToName[v.Id] = v.Name
		mappingContentIdToCurriculumGroupId[v.Id] = req.CurriculumGroupId
	}

	tx, err := service.repositoryStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //Id(ห้ามแก้)
		row2 := record[2] //ชื่อย่อ
		row3 := record[3] //มาตราฐาน
		row4 := record[4] //สาระ
		row5 := record[5] //สถานะ

		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}

		var contentId int
		for ctId, cgId := range mappingContentIdToCurriculumGroupId {
			if cgId == req.CurriculumGroupId && mappingContentIdToName[ctId] == row4 {
				contentId = ctId
				break
			}
		}

		if contentId == 0 {
			return errors.Errorf("CSVFile RowNo: %s is error by curriculumGroupId not match", record[0])
		}

		//prepare Struct to save
		if id != 0 {
			//update
			learningAreaEntity := constant.CriteriaUpdateRequest{
				Id:        id,
				ContentId: contentId,
				Name:      row3,
				ShortName: row2,
				Status:    row5,
				UpdatedBy: req.SubjectId,
			}
			err = service.repositoryStorage.CriteriaUpdate(learningAreaEntity, tx)
		} else {
			//create
			learningAreaEntity := constant.CriteriaCreateRequest{
				ContentId: contentId,
				Name:      row3,
				ShortName: row2,
				Status:    row5,
				CreatedBy: req.SubjectId,
			}
			err = service.repositoryStorage.CriteriaCreate(learningAreaEntity, tx)
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

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.CriteriaCSVHeader)
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
