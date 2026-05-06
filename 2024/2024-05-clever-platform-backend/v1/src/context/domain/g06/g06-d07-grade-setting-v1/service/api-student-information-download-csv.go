package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

type StudentInformationDownloadCsvRequest struct {
	constant.GradeEvaluationStudentFilter
	SubjectId string
}

type StudentInformationDownloadCsvResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentInformationDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentInformationDownloadCsvRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, errors.New("subjectId is empty"))
	}
	request.SubjectId = subjectId

	fileContent, err := api.Service.StudentInformationCsvDownload(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=grade_student_information.csv")
	return context.Status(http.StatusOK).Send(fileContent)
}

func (service *serviceStruct) StudentInformationCsvDownload(req *StudentInformationDownloadCsvRequest) ([]byte, error) {

	list, err := service.gradeSettingStorage.GradeEvaluationStudentList(req.GradeEvaluationStudentFilter, nil)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	existStudent := map[string]bool{}
	csvData := [][]string{constant.StudentInformationCSVHeader}
	for _, v := range list {

		//check duplicate student
		if v.CitizenNo != nil {
			if ok := existStudent[*v.CitizenNo]; ok {
				continue
			}
			existStudent[*v.CitizenNo] = true
		}

		csvData = append(csvData, []string{
			helper.HandleStringPointerField(v.SchoolCode),
			helper.HandleStringPointerField(v.SchoolName),
			helper.HandleStringPointerField(v.CitizenNo),
			helper.HandleStringPointerField(v.Year),
			helper.HandleStringPointerField(v.SchoolRoom),
			helper.HandleStringPointerField(v.StudentID),
			helper.HandleStringPointerField(v.Gender),
			helper.HandleStringPointerField(v.Title),
			helper.HandleStringPointerField(v.ThaiFirstName),
			helper.HandleStringPointerField(v.ThaiLastName),
			helper.HandleStringPointerField(v.BirthDate),
			helper.HandleStringPointerField(v.Ethnicity),
			helper.HandleStringPointerField(v.Nationality),
			helper.HandleStringPointerField(v.Religion),
			helper.HandleStringPointerField(v.ParentMaritalStatus),
			helper.HandleStringPointerField(v.FatherTitle),
			helper.HandleStringPointerField(v.FatherFirstName),
			helper.HandleStringPointerField(v.FatherLastName),
			helper.HandleStringPointerField(v.MotherTitle),
			helper.HandleStringPointerField(v.MotherFirstName),
			helper.HandleStringPointerField(v.MotherLastName),
			helper.HandleStringPointerField(v.GuardianRelation),
			helper.HandleStringPointerField(v.GuardianTitle),
			helper.HandleStringPointerField(v.GuardianFirstName),
			helper.HandleStringPointerField(v.GuardianLastName),
			helper.HandleStringPointerField(v.AddressNo),
			helper.HandleStringPointerField(v.AddressMoo),
			helper.HandleStringPointerField(v.AddressSubDistrict),
			helper.HandleStringPointerField(v.AddressDistrict),
			helper.HandleStringPointerField(v.AddressProvince),
			helper.HandleStringPointerField(v.AddressPostalCode),
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return bytes, nil
}
