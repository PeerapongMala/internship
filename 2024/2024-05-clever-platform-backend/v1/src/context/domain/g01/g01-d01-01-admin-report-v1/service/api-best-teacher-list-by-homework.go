package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type BestTeacherListByHomeworkRequest struct {
	constant.BestTeacherListByClassStarsFilter
}

// ==================== Response ==========================

type BestTeacherListByHomeworkResponse struct {
	StatusCode int                                  `json:"status_code"`
	Pagination *helper.Pagination                   `json:"_pagination"`
	Data       []constant.BestTeacherListByHomework `json:"data"`
	Message    string                               `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) BestTeacherListByHomework(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &BestTeacherListByHomeworkRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	bestTeachersListByHomework, err := api.Service.BestTeacherListByHomework(&BestTeacherListByHomeworkInput{
		Pagination:                        pagination,
		BestTeacherListByClassStarsFilter: &request.BestTeacherListByClassStarsFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=best-teacher-list-by-homework.csv")
	return context.Status(http.StatusOK).Send(bestTeachersListByHomework.FileContent)
}

// ==================== Service ==========================

type BestTeacherListByHomeworkInput struct {
	Pagination *helper.Pagination
	*constant.BestTeacherListByClassStarsFilter
}

type BestTeacherListByHomeworkOutput struct {
	FileContent []byte
}

func (service *serviceStruct) BestTeacherListByHomework(in *BestTeacherListByHomeworkInput) (*BestTeacherListByHomeworkOutput, error) {
	bestTeachers, err := service.Storage.BestTeacherListByHomework(in.Pagination, in.BestTeacherListByClassStarsFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{helper.FilterRow(constant.BestTeacherListByHomeworkCsvHeader, in.Columns)}
	for _, teacher := range bestTeachers {
		csvData = append(csvData, helper.FilterRow([]string{
			helper.HandleStringPointerField(teacher.SchoolName),
			helper.HandleStringPointerField(teacher.TeacherTitle),
			helper.HandleStringPointerField(teacher.TeacherFirstName),
			helper.HandleStringPointerField(teacher.TeacherLastName),
			helper.HandleIntPointerField(teacher.HomeworkCount),
			helper.HandleIntPointerField(teacher.WeekCount),
			helper.HandleTimePointerToField(teacher.LastLogin),
		}, in.Columns))
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &BestTeacherListByHomeworkOutput{
		FileContent: bytes,
	}, nil
}
