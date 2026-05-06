package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type BestTeacherListByClassStarsRequest struct {
	constant.BestTeacherListByClassStarsFilter
}

// ==================== Response ==========================

type BestTeacherListByClassStarsResponse struct {
	StatusCode int                                    `json:"status_code"`
	Pagination *helper.Pagination                     `json:"_pagination"`
	Data       []constant.BestTeacherListByClassStars `json:"data"`
	Message    string                                 `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) BestTeacherListByClassStars(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &BestTeacherListByClassStarsRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	bestTeachersListByClassStarsOutput, err := api.Service.BestTeacherListByClassStars(&BestTeacherListByClassStarsInput{
		Pagination:                        pagination,
		BestTeacherListByClassStarsFilter: &request.BestTeacherListByClassStarsFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=best-teacher-list-by-class-stars.csv")
	return context.Status(http.StatusOK).Send(bestTeachersListByClassStarsOutput.FileContent)
}

// ==================== Service ==========================

type BestTeacherListByClassStarsInput struct {
	Pagination *helper.Pagination
	*constant.BestTeacherListByClassStarsFilter
}

type BestTeacherListByClassStarsOutput struct {
	FileContent []byte
}

func (service *serviceStruct) BestTeacherListByClassStars(in *BestTeacherListByClassStarsInput) (*BestTeacherListByClassStarsOutput, error) {
	bestTeachers, err := service.Storage.BestTeacherListByClassStars(in.Pagination, in.BestTeacherListByClassStarsFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{helper.FilterRow(constant.BestTeacherListByClassStarsCsvHeader, in.Columns)}
	for _, teacher := range bestTeachers {
		//allClassInUse := "ไม่ครบ"
		//if teacher.AllClassInUse {
		//	allClassInUse = "ครบ"
		//}
		csvData = append(csvData, helper.FilterRow([]string{
			helper.HandleStringPointerField(teacher.SchoolName),
			helper.HandleStringPointerField(teacher.TeacherTitle) + " " + helper.HandleStringPointerField(teacher.TeacherFirstName) + " " + helper.HandleStringPointerField(teacher.TeacherLastName),
			helper.HandleStringPointerField(teacher.Year),
			helper.HandleStringPointerField(teacher.ClassName),
			helper.HandleIntPointerField(teacher.StudentCount),
			helper.HandleFloatPointerField(teacher.Stars),
			helper.HandleFloatPointerField(teacher.Levels),
		}, in.Columns))
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &BestTeacherListByClassStarsOutput{
		FileContent: bytes,
	}, nil
}
