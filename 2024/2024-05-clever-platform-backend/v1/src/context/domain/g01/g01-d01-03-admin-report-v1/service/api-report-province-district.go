package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type ReportProvinceDistrictRequest struct {
	constant.ReportProvinceDistrictFilter
}

// ==================== Response ==========================
type ReportProvinceDistrictResponse struct {
	StatusCode int                                  `json:"status_code"`
	Data       *constant.ReportProvinceDistrictData `json:"data"`
	Message    string                               `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ReportProvinceDistrict(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &ReportProvinceDistrictRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp, err := api.Service.ReportProvinceDistrict(&ReportProvinceDistrictInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ReportProvinceDistrictResponse{
		StatusCode: http.StatusOK,
		Data:       resp.ReportProvinceDistricts,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
type ReportProvinceDistrictInput struct {
	*ReportProvinceDistrictRequest
}

type ReportProvinceDistrictOutput struct {
	ReportProvinceDistricts *constant.ReportProvinceDistrictData
}

func (service *serviceStruct) ReportProvinceDistrict(in *ReportProvinceDistrictInput) (*ReportProvinceDistrictOutput, error) {

	schoolStats, err := service.adminReportStorage.GetSchoolStatsByProvinceAndDistrict(in.Province, in.District, CalcuratePossibleAcademicYear(in.StartDate, in.EndDate))
	if err != nil {
		return nil, err
	}

	maxStat, err := service.adminReportStorage.GetStatPlayCountAll(in.StartDate, in.EndDate, in.District)
	if err != nil {
		return nil, err
	}

	stat, err := service.adminReportStorage.GetStatPlayCountByProvinceDistrict(in.Province, in.District, in.StartDate, in.EndDate)
	if err != nil {
		return nil, err
	}

	var avgStarCount float64
	if helper.Deref(schoolStats.StudentCount) != 0 {
		avgStarCount = float64(helper.Deref(stat.SumTotalStar)) / float64(helper.Deref(schoolStats.StudentCount))
	} else {
		avgStarCount = 0
	}

	//replace min stat count because some user not play game
	var minStarCount int
	if helper.Deref(stat.StudentCount) != helper.Deref(schoolStats.StudentCount) {
		minStarCount = 0
	} else {
		minStarCount = helper.Deref(stat.MinTotalStar)
	}

	var percentageStar float64
	if helper.Deref(maxStat.MaxTotalStar) != 0 {
		percentageStar = (avgStarCount) / float64(helper.Deref(maxStat.MaxTotalStar)) * 100
	} else {
		percentageStar = 0
	}

	resp := &constant.ReportProvinceDistrictData{
		TotalSchoolCount:        helper.Deref(schoolStats.SchoolCount),
		TotalClassRoomCount:     helper.Deref(schoolStats.ClassRoomCount),
		TotalStudentCount:       helper.Deref(schoolStats.StudentCount),
		CountryMaximumStarCount: helper.Deref(maxStat.MaxTotalStar),
		AvgStarCount:            helper.Round(avgStarCount),
		PercentageStar:          helper.Round(percentageStar),
		MaximumStarCount:        helper.Deref(stat.MaxTotalStar),
		MinimumStarCount:        minStarCount,
	}

	return &ReportProvinceDistrictOutput{
		ReportProvinceDistricts: resp,
	}, nil
}

func CalcuratePossibleAcademicYear(startDate string, endDate string) []int {

	startDateTime, err := helper.ConvertTimeStringToTime(startDate)
	if err != nil {
		return []int{}
	}

	endDateTime, err := helper.ConvertTimeStringToTime(endDate)
	if err != nil {
		return []int{}
	}

	yearStart := startDateTime.Year()
	yearEnd := endDateTime.Year()

	return []int{yearStart, yearStart + 543, yearEnd, yearEnd + 543}
}
