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
type Request struct {
	constant.CSVUploadRequest
}

func (api *APIStruct) LearningContentUploadCSV(context *fiber.Ctx) error {
	var limit = sql.NullInt64{
		Int64: 1000000,
		Valid: true,
	}
	pagination := helper.Pagination{
		Page:       1,
		Limit:      limit,
		TotalCount: 0,
	}
	request, err := helper.ParseAndValidateRequest(context, &Request{})
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
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.Csvfile = csvFile
	request.SubjectId = subjectId
	request.Roles = roles

	if adminLoginAs != "" {
		request.AdminLoginAs = &adminLoginAs
	}
	filter := constant.CriteriaFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.LearningContentUploadCSV(request, filter, &pagination)
	if err != nil {
		if err.Error() == "user not allowed" {
			msg := "User isn't content creator of this curriculum group"
			return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusForbidden, &msg))
		}
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}

func (service *serviceStruct) LearningContentUploadCSV(req *Request, filter constant.CriteriaFilter, pagination *helper.Pagination) error {
	check := false
	for _, role := range req.Roles {
		if role == int(userConstant.Admin) {
			check = true
			break
		}
	}
	if !check {
		_, err := service.repositoryStorage.CheckContentCreator(req.CurriculumGroupId, req.SubjectId)

		if err != nil {
			if err.Error() == "user not allowed" {
				return fmt.Errorf("user not allowed")
			}
			return err

		}
	}
	criteriaData, _, err := service.repositoryStorage.GetCriteria(req.CurriculumGroupId, filter, pagination)
	if err != nil {
		return err
	}

	mappingCriteriaIdToName := map[int]string{}
	mappingCriteriaIdToShortName := map[int]string{}
	mappingCriteriaIdToCurriculumGroupId := map[int]int{}
	for _, v := range criteriaData {
		mappingCriteriaIdToName[v.Id] = v.Name
		mappingCriteriaIdToShortName[v.Id] = v.ShortName
		mappingCriteriaIdToCurriculumGroupId[v.Id] = req.CurriculumGroupId

	}

	tx, err := service.repositoryStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //ID(ห้ามแก้)
		row2 := record[2] //สาระการเรียนรู้
		row3 := record[3] //ชื่่อย่อมาตรฐาน
		row4 := record[4] //มาตรฐาน
		row5 := record[5] //สถานะ
		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}

		var criteriaId int
		for ctrId, cgId := range mappingCriteriaIdToCurriculumGroupId {
			if cgId == req.CurriculumGroupId && mappingCriteriaIdToName[ctrId] == row4 && mappingCriteriaIdToShortName[ctrId] == row3 {
				criteriaId = ctrId

				break
			}
		}

		if criteriaId == 0 {
			return errors.Errorf("CSVFile RowNo: %s is error by curriculumGroupId not match", record[0])
		}
		if id != 0 {

			err = service.repositoryStorage.LearningContentUpdate(constant.LearningContentUpdateRequest{
				Id:         id,
				CriteriaId: criteriaId,
				Name:       row2,
				Status:     row5,
				UpdatedBy:  req.SubjectId,
			}, tx)
		} else {
			err = service.repositoryStorage.LearningContentCreate(constant.LearningContentCreateRequest{
				CriteriaId: criteriaId,
				Name:       row2,
				Status:     row5,
				CreatedBy:  req.SubjectId,
			}, tx)
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

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.LearningContentCSVHeader)
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
