package service

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) TeacherAnnouncementCsvUplod(context *fiber.Ctx) error {
	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
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
	request := constant.CSVUploadRequest{
		Csvfile: csvFile,
	}
	Check := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	err = api.Service.TeacherAnnounceCsvUpload(request, Check)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}
func (service *serviceStruct) TeacherAnnounceCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error {
	schoolId, err := service.TeacherannounceStorage.GetSchoolByUserId(Role.SubjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	schoolList, err := service.TeacherannounceStorage.SChoolList()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	SchoolIdToName := map[int]string{}
	for _, v := range schoolList {
		SchoolIdToName[v.Id] = v.Name
	}
	callback := func(record []string) error {
		row0 := record[0] //No
		row1 := record[1] //ID(ห้ามแก้)
		row2 := record[2] //ชื่อโรงเรียน
		row3 := record[3] //ขอบเขต(โรงเรียน/วิชา)
		row4 := record[4] //ประเภทของประกาศ
		row5 := record[5] //คำนำ
		row6 := record[6] //คำอธิบาย
		row7 := record[7] //วันเริ่มต้น
		row8 := record[8] //วันสิ้นสุด
		row9 := record[9] //สถานะ
		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}
		var SchoolId int

		for SchId, SchName := range SchoolIdToName {
			if row2 == SchName {
				SchoolId = SchId
				break
			}

		}
		if SchoolId != schoolId {
			msg := fmt.Sprintf("CSVFile RowNo: %s is error by User is not a member of %s", record[0], record[2])
			return helper.NewHttpError(http.StatusForbidden, &msg)
		}
		if SchoolId == 0 {
			return errors.Errorf("CSVFile RowNo: %s is error by school not exist", record[0])
		}
		startAt, err := helper.ConvertTimeStringToTime(row7)
		if err != nil {
			return errors.Errorf("CSVFile RowNo: %s has invalid StartAt: %s", row0, row7)
		}

		endAt, err := helper.ConvertTimeStringToTime(row8)
		if err != nil {
			return errors.Errorf("CSVFile RowNo: %s has invalid EndAt: %s", row0, row8)
		}
		var Admin *string
		for _, role := range Role.Roles {
			if role == int(userConstant.Admin) {
				Admin = &Role.SubjectId
				break
			}
		}
		if id != 0 {

			err = service.TeacherannounceStorage.AnnouncementUpdate(constant.TeacherAnnounceUpdate{
				Id:           id,
				SchoolId:     SchoolId,
				Scope:        row3,
				Type:         row4,
				Title:        row5,
				Description:  row6,
				StartAt:      *startAt,
				EndAt:        *endAt,
				Status:       row9,
				UpdatedBy:    Role.SubjectId,
				AdminLoginAs: Admin,
			})
		} else {
			err = service.TeacherannounceStorage.AnnouncementCreate(constant.TeacherAnnounceCreate{
				SchoolId:     SchoolId,
				Scope:        row3,
				Type:         row4,
				Title:        row5,
				Description:  row6,
				StartAt:      *startAt,
				EndAt:        *endAt,
				Status:       row9,
				CreatedBy:    Role.SubjectId,
				AdminLoginAs: Admin,
			})

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

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.TeacherAnnounceCsvHeader)
	if err != nil {
		return err
	}

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
