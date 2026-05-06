package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strconv"
)

// ==================== Request ==========================

// ==================== Response ==========================

type GradeEvaluationFormDownloadCsvResponse struct {
	Pagination *helper.Pagination             `json:"_pagination"`
	StatusCode int                            `json:"status_code"`
	Data       []constant.GradeFormListEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeEvaluationFormDownloadCsv(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &GradeEvaluationFormListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.GradeEvaluationFormDownloadCsv(GradeFormListInput{
		Request:    request,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=grade_evaluation_form.csv")
	return context.Status(http.StatusOK).Send(resp.FileContent)
}

// ==================== Service ==========================
type GradeFormDownloadCsvInput struct {
	SchoolId   int
	Pagination *helper.Pagination
}

type GradeFormDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) GradeEvaluationFormDownloadCsv(in GradeFormListInput) (*GradeFormDownloadCsvOutput, error) {
	gradeEvaluationFormDownloadCsv, err := service.gradeFormStorage.GradeEvaluationFormList(in.Request.GradeEvaluationFormListFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.GradeEvaluationFormCSVHeader}
	for i, v := range gradeEvaluationFormDownloadCsv {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			helper.HandleIntPointerField(v.Id),
			helper.HandleIntPointerField(v.TempalteId),
			helper.HandleStringPointerField(v.TemplateName),
			helper.HandleStringPointerField(v.AcademicYear),
			helper.HandleStringPointerField(v.Year),
			helper.HandleStringPointerField(v.SchoolRoom),
			helper.HandleStringPointerField(v.SchoolTerm),
			helper.HandleBooleanPointerField(v.IsLock),
			helper.HandleStringPointerField(v.GetStatus()),
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &GradeFormDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
