package service

import (
	"log"
	"net/http"
	"strconv"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) EventAnnounceCSVUpload(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
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
		Csvfile:    csvFile,
		Pagination: pagination,
	}
	Check := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	err = api.Service.EventAnnounceCsvUpload(request, Check)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}
func (service *serviceStruct) EventAnnounceCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error {
	Schools, _, err := service.GmannounceStorage.SchoolList(req.Pagination)
	if err != nil {
		return err
	}
	filter := constant.SubjectFilter{}
	Subjects, _, err := service.GmannounceStorage.SubjectList(req.Pagination, filter)
	if err != nil {
		return err
	}
	pagination := helper.PaginationDefault()
	GameList, _, err := service.GmannounceStorage.ArcadeGameList(pagination)
	if err != nil {
		return err
	}
	SchoolIdToName := map[int]string{}
	for _, v := range Schools {
		SchoolIdToName[v.SchoolId] = v.SchoolName
	}
	SubjcetIdToName := map[int]string{}
	for _, v := range Subjects {
		SubjcetIdToName[v.SubjectId] = v.SubjectName

	}
	GameIdToName := map[int]string{}
	for _, v := range GameList {
		GameIdToName[v.ArcadeGameId] = v.ArcadeGameName
	}

	callback := func(record []string) error {
		row0 := record[0]   //No
		row1 := record[1]   //ID(ห้ามแก้)
		row2 := record[2]   //ชื่อโรงเรียน
		row3 := record[3]   //ขอบเขต(โรงเรียน/วิชา)
		row4 := record[4]   //ประเภทของประกาศ
		row5 := record[5]   //คำนำ
		row6 := record[6]   //คำอธิบาย
		row7 := record[7]   //ชื่อวิชา
		row8 := record[8]   //ชื่อกิจกรรม
		row9 := record[9]   //ปีการศึกษา
		row10 := record[10] //วันเริ่มต้น
		row11 := record[11] //วันสิ้นสุด
		row12 := record[12] //สถานะ
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
		var SubjectId int
		for SjId, SjName := range SubjcetIdToName {
			if row7 == SjName {
				SubjectId = SjId
				break
			}
		}
		var GameId int
		for GId, GName := range GameIdToName {
			if row8 == GName {
				GameId = GId
				break

			}
		}
		if SchoolId == 0 {
			return errors.Errorf("CSVFile RowNo: %s is error by School not exist", record[0])
		}
		if SubjectId == 0 {
			return errors.Errorf("CSVFile RowNo: %s is error by Subject not exist", record[0])
		}
		if GameId == 0 {
			return errors.Errorf("CSVFile RowNo: %s is error by Arcade game not exist", record[0])
		}

		startAt, err := helper.ConvertTimeStringToTime(row10)
		if err != nil {
			return errors.Errorf("CSVFile RowNo: %s has invalid StartAt: %s", row0, row10)
		}

		endAt, err := helper.ConvertTimeStringToTime(row11)
		if err != nil {
			return errors.Errorf("CSVFile RowNo: %s has invalid EndAt: %s", row0, row11)
		}
		var Admin *string
		for _, role := range Role.Roles {
			if role == int(userConstant.Admin) {
				Admin = &Role.SubjectId
				break
			}
		}
		AcademicYear, err := strconv.Atoi(row9)
		if id != 0 {
			err = service.GmannounceStorage.UpdateEventAnnounce(constant.UpdateEventAnnounceRequest{
				Id:           id,
				SchoolId:     SchoolId,
				Scope:        row3,
				Type:         row4,
				Title:        row5,
				SubjectId:    SubjectId,
				ArcadeGameId: GameId,
				Description:  row6,
				AcademicYear: AcademicYear,
				StartAt:      *startAt,
				EndAt:        *endAt,
				Status:       row12,
				UpdatedBy:    Role.SubjectId,
				AdminLoginAs: Admin,
			})
		} else {
			err = service.GmannounceStorage.AddEventAnnounce(constant.CreateEventAnnounceRequest{

				SchoolId:     SchoolId,
				Scope:        row3,
				Type:         row4,
				Title:        row5,
				SubjectId:    SubjectId,
				ArcadeGameId: GameId,
				Description:  row6,
				AcademicYear: AcademicYear,
				StartAt:      *startAt,
				EndAt:        *endAt,
				Status:       row12,
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

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.EventAnnounceCsvHeader)
	if err != nil {
		return err
	}

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
