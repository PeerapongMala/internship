package service

import (
	"bytes"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strconv"
)

// @Id G01D05A13Get
// @Tags Admin Classroom
// @Summary Download teachers CSV
// @Description ดาวน์โหลดข้อมูลครูในห้องเรียนเป็น CSV
// @Security BearerAuth
// @Produce text/csv
// @Param classRoomId path int true "classRoomId"
// @Success 200 {string} string "CSV file"
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/teachers/download/csv [get]
func (api *APiStruct) TeacherDownloadCSV(context *fiber.Ctx) error {
	classRoomId, err := context.ParamsInt("classRoomId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	output, err := api.Service.TeacherDownloadCSV(&TeacherDownloadCSVInput{
		ClassRoomId: classRoomId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Attachment("teachers.csv")
	return context.SendStream(output.CSVReader)
}

type TeacherDownloadCSVInput struct {
	ClassRoomId int
}

type TeacherDownloadCSVOutput struct {
	CSVReader *bytes.Reader
}

func (service *serviceStruct) TeacherDownloadCSV(in *TeacherDownloadCSVInput) (*TeacherDownloadCSVOutput, error) {
	teachers, err := service.storage.TeacherListGetByClassroom(in.ClassRoomId)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.TeacherCSVHeader}
	for i, t := range teachers {
		lastLogin := ""
		if t.LastLogin != nil {
			lastLogin = t.LastLogin.Format("2006-01-02 15:04:05")
		}
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			t.Id,
			helper.HandleStringPointerField(t.Title),
			helper.HandleStringPointerField(t.FirstName),
			helper.HandleStringPointerField(t.LastName),
			helper.HandleStringPointerField(t.Email),
			lastLogin,
		})
	}

	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &TeacherDownloadCSVOutput{
		CSVReader: bytes.NewReader(dataBytes),
	}, nil
}
