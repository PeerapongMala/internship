package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type BestSchoolListByAvgClassStarsRequest struct {
	constant.BestTeacherListByClassStarsFilter
}

// ==================== Response ==========================

type BestSchoolListByAvgClassStarsResponse struct {
	StatusCode int                                      `json:"status_code"`
	Pagination *helper.Pagination                       `json:"_pagination"`
	Data       []constant.BestSchoolListByAvgClassStars `json:"data"`
	Message    string                                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) BestSchoolListByAvgClassStars(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &BestSchoolListByAvgClassStarsRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	bestSchoolListByAvgClassStarsOutput, err := api.Service.BestSchoolListByAvgClassStars(&BestSchoolListByAvgClassStarsInput{
		Pagination:                        pagination,
		BestTeacherListByClassStarsFilter: &request.BestTeacherListByClassStarsFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=best-school-list-by-avg-class-stars.csv")
	return context.Status(http.StatusOK).Send(bestSchoolListByAvgClassStarsOutput.FileContent)
}

// ==================== Service ==========================

type BestSchoolListByAvgClassStarsInput struct {
	Pagination *helper.Pagination
	*constant.BestTeacherListByClassStarsFilter
}

type BestSchoolListByAvgClassStarsOutput struct {
	FileContent []byte
}

func (service *serviceStruct) BestSchoolListByAvgClassStars(in *BestSchoolListByAvgClassStarsInput) (*BestSchoolListByAvgClassStarsOutput, error) {
	bestSchools, err := service.Storage.BestSchoolListByAvgClassStars(in.Pagination, in.BestTeacherListByClassStarsFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{helper.FilterRow(constant.BestSchoolListByAvgClassStarsCsvHeader, in.Columns)}
	for _, school := range bestSchools {
		csvData = append(csvData, helper.FilterRow([]string{
			helper.HandleStringPointerField(school.SchoolName),
			helper.HandleIntPointerField(school.ClassCount),
			helper.HandleIntPointerField(school.TeacherCount),
			helper.HandleIntPointerField(school.StudentCount),
			helper.HandleFloatPointerField(school.AvgStars),
			helper.HandleIntPointerField(school.ActiveClassCount),
			helper.HandleIntPointerField(school.ActiveStudentCount),
		}, in.Columns))
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &BestSchoolListByAvgClassStarsOutput{
		FileContent: bytes,
	}, nil
}
