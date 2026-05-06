package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

func (api *APIStruct) TeacherRewardCsvUpload(context *fiber.Ctx) error {
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
	err = api.Service.TeacherRewardCsvUpload(request, Check)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: http.StatusCreated,
		Message:    "OK",
	})
}
func (service *serviceStruct) TeacherRewardCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error {
	//var Admin *string
	//for _, role := range Role.Roles {
	//	if role == int(userConstant.Admin) {
	//		Admin = &Role.SubjectId
	//		break
	//	}
	//}
	//Subjects, err := service.teacherRewardStorage.GetSubjectByTeacherId(Role.SubjectId)
	//if err != nil {
	//	log.Printf("%+v", errors.WithStack(err))
	//	return err
	//}
	//
	//SubjectIdToName := map[int]string{}
	//for _, v := range Subjects {
	//	SubjectIdToName[v.SubjectId] = v.SubjectName
	//}
	//
	//GlobalItems, err := service.teacherRewardStorage.GetGlobalItem()
	//if err != nil {
	//	log.Printf("%+v", errors.WithStack(err))
	//	return err
	//}
	//
	//GlobalIdToName := map[int]string{}
	//for _, v := range GlobalItems {
	//	GlobalIdToName[v.ItemId] = v.ItemName
	//}
	//
	//Teacheritems, err := service.teacherRewardStorage.GetTeacherItem(Role.SubjectId)
	//if err != nil {
	//	log.Printf("%+v", errors.WithStack(err))
	//	return err
	//}
	//TeacherIdToName := map[int]string{}
	//for _, v := range Teacheritems {
	//	TeacherIdToName[v.ItemId] = v.ItemName
	//}
	//TeacherReward, err := service.teacherRewardStorage.TeacherRewardList(Role.SubjectId, constant.TeacherRewardListFilter{}, helper.PaginationDefault())
	//if err != nil {
	//	log.Printf("%+v", errors.WithStack(err))
	//	return err
	//}
	//callback := func(record []string) error {
	//	row0 := record[0] //No
	//	row1 := record[1] //ID(ห้ามแก้)
	//	row2 := record[2] //ชื่อวิชา
	//	row3 := record[3] //ชื่อนักเรียน
	//	row4 := record[4] //นามสกุลนักเรียน
	//	row5 := record[5] //ชั้นปี(ห้ามแก้)
	//	row6 := record[6] //ห้อง(ห้ามแก้)
	//	row7 := record[7] //ชื่อไอเทม
	//	row8 := record[8] //จำนวน
	//
	//	var id int
	//	if row1 != "" {
	//		id, err = strconv.Atoi(row1)
	//		if err != nil {
	//			log.Printf("%+v", errors.WithStack(err))
	//			return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
	//		}
	//	}
	//
	//	for _, v := range TeacherReward {
	//		if row1 == "" {
	//			continue
	//		}
	//		id, err := strconv.Atoi(row1)
	//		if err != nil {
	//			return err
	//		}
	//		if id == v.Id {
	//			return errors.Errorf("CSVFile RowNo: %s is error by unable to update the existing ID %s data", row1, record[1])
	//		}
	//	}
	//	var SubjectId int
	//
	//	for SjId, SjName := range SubjectIdToName {
	//		if row2 == SjName {
	//			SubjectId = SjId
	//			break
	//
	//		}
	//	}
	//
	//	if SubjectId == 0 {
	//		return errors.Errorf("CSVFile RowNo: %s is error by teacher not own Subject : %s", record[0], record[2])
	//	}
	//	StudentId, err := service.teacherRewardStorage.GetStudentIdByStudentName(row3, row4)
	//	if err != nil {
	//		log.Printf("%+v", errors.WithStack(err))
	//		return err
	//	}
	//	if StudentId == "" {
	//		return errors.Errorf("CSVFile RowNo: %s AND %s is error by student name not exist", record[3], record[4])
	//	}
	//	ClassId, err := service.teacherRewardStorage.GetClassByStudentId(StudentId)
	//	if err != nil {
	//		log.Printf("%+v", errors.WithStack(err))
	//		return err
	//	}
	//	var ItemId int
	//	for GitemId, GitemName := range GlobalIdToName {
	//		if row7 == GitemName {
	//			ItemId = GitemId
	//			break
	//
	//		}
	//	}
	//	if ItemId == 0 {
	//		for TitemId, TitemName := range TeacherIdToName {
	//			if row7 == TitemName {
	//				ItemId = TitemId
	//				break
	//			}
	//		}
	//	}
	//	if ItemId == 0 {
	//		return errors.Errorf("CSVFile RowNo: %s  is error by item is not exist", record[7])
	//	}
	//
	//	if id == 0 {
	//		if row5 != "" && row6 != "" {
	//			return errors.Errorf("CSVFile RowNo: %s AND %s  is error no need to fill these column", record[5], record[6])
	//		}
	//		//SubjectTeacher, err := service.teacherRewardStorage.GetSubjectTeacherBySubjectId(SubjectId, Role.SubjectId)
	//		//if err != nil {
	//		//	log.Printf("%+v", errors.WithStack(err))
	//		//	return err
	//		//}
	//		amount, err := strconv.Atoi(row8)
	//		if err != nil {
	//			return err
	//		}
	//		req := constant.TeacherRewardCreate{
	//			//SubjectTeacherId: SubjectTeacher,
	//			StudentId:    StudentId,
	//			ClassId:      ClassId,
	//			ItemId:       ItemId,
	//			Amount:       amount,
	//			Status:       "send",
	//			CreatedBy:    Role.SubjectId,
	//			AdminLoginAs: Admin,
	//		}
	//		err = service.teacherRewardStorage.TeacherRewardCreate(nil, req)
	//		if err != nil {
	//			log.Printf("%+v", errors.WithStack(err))
	//			return err
	//		}
	//	}
	//	return nil
	//}
	//file, err := req.Csvfile.Open()
	//if err != nil {
	//	return err
	//}
	//defer file.Close()
	//
	//err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.TeacherRewardCsvHeader)
	//if err != nil {
	//	return err
	//}
	//
	//if err != nil {
	//	log.Printf("%+v", errors.WithStack(err))
	//	return err
	//}
	//return nil
	return nil
}
