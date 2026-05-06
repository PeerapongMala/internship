package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type BestTeacherListByLessonRequest struct {
	constant.BestTeacherListByClassStarsFilter
}

// ==================== Response ==========================

type BestTeacherListByLessonResponse struct {
	StatusCode int                                `json:"status_code"`
	Pagination *helper.Pagination                 `json:"_pagination"`
	Data       []constant.BestTeacherListByLesson `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) BestTeacherListByLesson(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &BestTeacherListByHomeworkRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	bestTeachersListByLessonOutput, err := api.Service.BestTeacherListByLesson(&BestTeacherListByLessonInput{
		Pagination:                        pagination,
		BestTeacherListByClassStarsFilter: &request.BestTeacherListByClassStarsFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=best-lesson.csv")
	return context.Status(http.StatusOK).Send(bestTeachersListByLessonOutput.FileContent)
}

// ==================== Service ==========================

type BestTeacherListByLessonInput struct {
	Pagination *helper.Pagination
	*constant.BestTeacherListByClassStarsFilter
}

type BestTeacherListByLessonOutput struct {
	FileContent []byte
}

func (service *serviceStruct) BestTeacherListByLesson(in *BestTeacherListByLessonInput) (*BestTeacherListByLessonOutput, error) {
	bestTeachers, err := service.Storage.BestTeacherListByLesson(in.Pagination, in.BestTeacherListByClassStarsFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{helper.FilterRow(constant.BestTeacherListByLessonCsvHeader, in.Columns)}
	for _, teacher := range bestTeachers {
		csvData = append(csvData, helper.FilterRow([]string{
			helper.HandleStringPointerField(teacher.SchoolName),
			helper.HandleStringPointerField(teacher.AcademicYear),
			helper.HandleStringPointerField(teacher.Year),
			helper.HandleStringPointerField(teacher.ClassName),
			helper.HandleStringPointerField(teacher.CurriculumGroupName),
			helper.HandleStringPointerField(teacher.LessonName),
			helper.HandleStringPointerField(teacher.SubLessonName),
			helper.HandleFloatPointerField(teacher.Stars),
			helper.HandleFloatPointerField(teacher.Levels),
			helper.HandleIntPointerField(teacher.Attempts),
			helper.HandleFloatPointerField(teacher.AvgTime),
		}, in.Columns))
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &BestTeacherListByLessonOutput{
		FileContent: bytes,
	}, nil
}
