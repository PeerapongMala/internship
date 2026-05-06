package service

import (
	"bytes"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strconv"
)

// @Id G01D05A20Get
// @Tags Admin Classroom
// @Summary Download students CSV
// @Description ดาวน์โหลดรายชื่อนักเรียนในห้องเรียนเป็น CSV
// @Security BearerAuth
// @Produce text/csv
// @Param classRoomId path int true "classRoomId"
// @Success 200 {string} string "CSV file"
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/students/download/csv [get]
func (api *APiStruct) StudentDownloadCSV(context *fiber.Ctx) error {
	classRoomId, err := context.ParamsInt("classRoomId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	output, err := api.Service.StudentDownloadCSV(&StudentDownloadCSVInput{
		ClassRoomId: classRoomId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Attachment("students.csv")
	return context.SendStream(output.CSVReader)
}

type StudentDownloadCSVInput struct {
	ClassRoomId int
}

type StudentDownloadCSVOutput struct {
	CSVReader *bytes.Reader
}

func (service *serviceStruct) StudentDownloadCSV(in *StudentDownloadCSVInput) (*StudentDownloadCSVOutput, error) {
	students, err := service.storage.StudentListGetByClassroom(in.ClassRoomId)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.StudentCSVHeader}
	for i, s := range students {
		var lastLogin string
		if s.LastLogin != nil {
			lastLogin = s.LastLogin.Format("2006-01-02 15:04:05")
		}
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			s.Id,
			helper.HandleStringPointerField(s.Title),
			helper.HandleStringPointerField(s.FirstName),
			helper.HandleStringPointerField(s.LastName),
			lastLogin,
		})
	}

	dataBytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &StudentDownloadCSVOutput{
		CSVReader: bytes.NewReader(dataBytes),
	}, nil
}
