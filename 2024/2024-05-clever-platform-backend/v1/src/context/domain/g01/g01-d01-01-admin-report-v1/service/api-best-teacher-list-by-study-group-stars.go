package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type BestTeacherListByStudyGroupStarsRequest struct {
	constant.BestTeacherListByClassStarsFilter
}

// ==================== Response ==========================

type BestTeacherListByStudyGroupStarsResponse struct {
	StatusCode int                                         `json:"status_code"`
	Pagination *helper.Pagination                          `json:"_pagination"`
	Data       []constant.BestTeacherListByStudyGroupStars `json:"data"`
	Message    string                                      `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) BestTeacherListByStudyGroupStars(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &BestTeacherListByStudyGroupStarsRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	bestTeachersListByStudyGroupStars, err := api.Service.BestTeacherListByStudyGroupStars(&BestTeacherListByStudyGroupStarsInput{
		Pagination:                        pagination,
		BestTeacherListByClassStarsFilter: &request.BestTeacherListByClassStarsFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=best-teacher-list-by-study-group-stars.csv")
	return context.Status(http.StatusOK).Send(bestTeachersListByStudyGroupStars.FileContent)
}

// ==================== Service ==========================

type BestTeacherListByStudyGroupStarsInput struct {
	Pagination *helper.Pagination
	*constant.BestTeacherListByClassStarsFilter
}

type BestTeacherListByStudyGroupStarsOutput struct {
	FileContent []byte
}

func (service *serviceStruct) BestTeacherListByStudyGroupStars(in *BestTeacherListByStudyGroupStarsInput) (*BestTeacherListByStudyGroupStarsOutput, error) {
	bestStudyGroups, err := service.Storage.BestTeacherListByStudyGroupStars(in.Pagination, in.BestTeacherListByClassStarsFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{helper.FilterRow(constant.BestTeacherListByStudyGroupStarsCsvHeader, in.Columns)}
	for _, studyGroup := range bestStudyGroups {
		csvData = append(csvData, helper.FilterRow([]string{
			helper.HandleStringPointerField(studyGroup.SchoolName),
			helper.HandleStringPointerField(studyGroup.AcademicYear),
			helper.HandleStringPointerField(studyGroup.Year),
			helper.HandleStringPointerField(studyGroup.ClassName),
			helper.HandleStringPointerField(studyGroup.StudyGroupName),
			helper.HandleIntPointerField(studyGroup.StudentCount),
			helper.HandleFloatPointerField(studyGroup.Stars),
			helper.HandleFloatPointerField(studyGroup.Levels),
			helper.HandleIntPointerField(studyGroup.Attempts),
			helper.HandleFloatPointerField(studyGroup.AvgTime),
		}, in.Columns))
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &BestTeacherListByStudyGroupStarsOutput{
		FileContent: bytes,
	}, nil
}
