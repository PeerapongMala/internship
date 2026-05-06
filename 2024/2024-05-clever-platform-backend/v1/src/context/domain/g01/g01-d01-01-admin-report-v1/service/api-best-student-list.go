package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type BestStudentListRequest struct {
	constant.BestStudentListFilter
}

// ==================== Response ==========================

type BestStudentListResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.BestStudentEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) BestStudentList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &BestStudentListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	bestStudentListOutput, err := api.Service.BestStudentList(&BestStudentListInput{
		Pagination:            pagination,
		BestStudentListFilter: &request.BestStudentListFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=best-student-list.csv")
	return context.Status(http.StatusOK).Send(bestStudentListOutput.FileContent)
}

// ==================== Service ==========================

type BestStudentListInput struct {
	Pagination *helper.Pagination
	*constant.BestStudentListFilter
}

type BestStudentListOutput struct {
	FileContent []byte
}

func (service *serviceStruct) BestStudentList(in *BestStudentListInput) (*BestStudentListOutput, error) {
	bestStudents, err := service.Storage.BestStudentList(in.Pagination, in.BestStudentListFilter)
	if err != nil {
		return nil, err
	}

	var csvData [][]string
	if in.OrderBy == 1 {
		csvData = [][]string{helper.FilterRow(constant.BestStudentListLevelCsvHeader, in.Columns)}
		for _, student := range bestStudents {
			csvData = append(csvData, helper.FilterRow([]string{
				helper.HandleStringPointerField(student.SchoolName),
				helper.HandleStringPointerField(student.StudentFirstName) + " " + helper.HandleStringPointerField(student.StudentLastName),
				helper.HandleStringPointerField(student.Year),
				helper.HandleStringPointerField(student.ClassName),
				helper.HandleIntPointerField(student.Levels),
			}, in.Columns))
		}
	}
	if in.OrderBy == 2 {
		csvData = [][]string{helper.FilterRow(constant.BestStudentListCsvHeader, in.Columns)}
		for _, student := range bestStudents {
			csvData = append(csvData, helper.FilterRow([]string{
				helper.HandleStringPointerField(student.SchoolName),
				helper.HandleStringPointerField(student.StudentFirstName) + " " + helper.HandleStringPointerField(student.StudentLastName),
				helper.HandleStringPointerField(student.Year),
				helper.HandleStringPointerField(student.ClassName),
				helper.HandleIntPointerField(student.Stars),
			}, in.Columns))
		}
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &BestStudentListOutput{
		FileContent: bytes,
	}, nil
}
