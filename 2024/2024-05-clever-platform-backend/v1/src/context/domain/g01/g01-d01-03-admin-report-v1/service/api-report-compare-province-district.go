package service

import (
	"math"
	"net/http"
	"slices"
	"sort"
	"sync"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type ReportCompareProvinceDistrictRequest struct {
	constant.ReportCompareProvinceDistrictFilter
	UserId       string
	ReportAccess *constant2.ReportAccessSimplify
}

// ==================== Response ==========================
type ReportCompareProvinceDistrictResponse struct {
	StatusCode int                                         `json:"status_code"`
	Data       *constant.ReportCompareProvinceDistrictData `json:"data"`
	Message    string                                      `json:"message"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) ReportCompareProvinceDistrict(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &ReportCompareProvinceDistrictRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserId = userId
	request.ReportAccess = reportAccess.Simplyfy()
	resp, err := api.Service.ReportCompareProvinceDistrict(&ReportCompareProvinceDistrictInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ReportCompareProvinceDistrictResponse{
		StatusCode: http.StatusOK,
		Data:       resp.ReportCompareProvinceDistricts,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
type ReportCompareProvinceDistrictInput struct {
	*ReportCompareProvinceDistrictRequest
}

type ReportCompareProvinceDistrictOutput struct {
	ReportCompareProvinceDistricts *constant.ReportCompareProvinceDistrictData
}

func (service *serviceStruct) ReportCompareProvinceDistrict(in *ReportCompareProvinceDistrictInput) (*ReportCompareProvinceDistrictOutput, error) {

	resp := &constant.ReportCompareProvinceDistrictData{}

	err := service.CreateAsyncProcess(in, resp)
	if err != nil {
		return nil, err
	}

	return &ReportCompareProvinceDistrictOutput{
		ReportCompareProvinceDistricts: resp,
	}, nil
}

func (service *serviceStruct) CreateAsyncProcess(in *ReportCompareProvinceDistrictInput, resp *constant.ReportCompareProvinceDistrictData) error {
	var wg sync.WaitGroup
	var mu sync.Mutex
	wg.Add(3)

	errChan := make(chan error, 3)

	go func() {
		defer wg.Done()
		data, e := service.GetStatUserData(in)
		mu.Lock()
		defer mu.Unlock()
		if e != nil {
			errChan <- e
			return
		}
		resp.StatUsage = data
		errChan <- nil
	}()

	go func() {
		defer wg.Done()
		data, e := service.GetOverAllProvinceData(in)
		mu.Lock()
		defer mu.Unlock()
		if e != nil {
			errChan <- e
			return
		}
		resp.OverAllProvince = data
		errChan <- nil
	}()

	go func() {
		defer wg.Done()
		data, e := service.GetTreeDistrictData(in)
		mu.Lock()
		defer mu.Unlock()
		if e != nil {
			errChan <- e
			return
		}
		resp.TreeDistrict = data
		errChan <- nil
	}()

	wg.Wait()
	close(errChan)

	for e := range errChan {
		if e != nil {
			return e
		}
	}

	return nil
}

func (service *serviceStruct) GetStatUserData(in *ReportCompareProvinceDistrictInput) ([]constant.StatUsageData, error) {

	var data []constant.AvgStatByProvinceEntity
	var err error

	//switch in.Province {
	//case "กรุงเทพหมานคร":
	//	data, err = service.adminReportStorage.GetAvgStatBKK(in.StartDate, in.EndDate)
	//default: //ต่างจังหวัด
	//	data, err = service.adminReportStorage.GetAvgStatByProvince(in.Province, in.StartDate, in.EndDate)
	//}
	data, err = service.adminReportStorage.GetAvgStatByProvince(in.Province, in.StartDate, in.EndDate)
	if err != nil {
		return nil, err
	}

	resp := []constant.StatUsageData{}
	for _, d := range data {
		resp = append(resp, constant.StatUsageData{
			Label: helper.Deref(d.District),
			Value: math.Round(helper.Deref(d.AvgTotalStar)*100) / 100,
		})
	}

	//sort logic
	if in.SortByAvgStarFlag == "true" {
		sort.Slice(resp, func(i, j int) bool {
			return resp[i].Value > resp[j].Value
		})
	} else {
		sort.Slice(resp, func(i, j int) bool {
			return resp[i].Label > resp[j].Label
		})
	}

	return resp, nil
}

func (service *serviceStruct) GetOverAllProvinceData(in *ReportCompareProvinceDistrictInput) (*constant.OverAllProvinceData, error) {

	countryStat, err := service.adminReportStorage.GetStatPlayCountByProvinceDistrict(in.Province, in.District, in.StartDate, in.EndDate)
	if err != nil {
		return nil, err
	}

	var avgCountryStarCount float64
	if helper.Deref(countryStat.StudentCount) != 0 {
		avgCountryStarCount = float64(helper.Deref(countryStat.SumTotalStar)) / float64(helper.Deref(countryStat.StudentCount))
	} else {
		avgCountryStarCount = 0
	}

	provinceStat, err := service.adminReportStorage.GetStatPlayCountByProvinceDistrict(in.Province, "", in.StartDate, in.EndDate)
	if err != nil {
		return nil, err
	}

	var avgProvinceStarCount float64
	if helper.Deref(provinceStat.StudentCount) != 0 {
		avgProvinceStarCount = float64(helper.Deref(provinceStat.SumTotalStar)) / float64(helper.Deref(provinceStat.StudentCount))
	} else {
		avgProvinceStarCount = 0
	}

	var percentageStar float64
	if helper.Deref(countryStat.MaxTotalStar) != 0 {
		percentageStar = (avgCountryStarCount) / float64(helper.Deref(countryStat.MaxTotalStar)) * 100
	} else {
		percentageStar = 0
	}

	resp := &constant.OverAllProvinceData{
		AvgCountryStarCount: helper.Round(avgCountryStarCount),
		MaxCountryStarCount: helper.Deref(countryStat.MaxTotalStar),
		PercentageStar:      helper.Round(percentageStar),
		AvgStarCount:        helper.Round(avgProvinceStarCount),
		MaxStarCount:        helper.Deref(provinceStat.MaxTotalStar),
		MinStarCount:        helper.Deref(provinceStat.MinTotalStar),
	}

	return resp, nil
}

func (service *serviceStruct) GetTreeDistrictData(in *ReportCompareProvinceDistrictInput) ([]constant.TreeDistrictData, error) {

	var resp []constant.TreeDistrictData
	var err error

	//switch in.Province {
	//case "กรุงเทพมหานคร":
	//	resp, err = service.adminReportStorage.GetTreeDistrictZoneBkk(in.StartDate, in.EndDate)
	//	//resp = FilterTreeByAccess(resp, in.ReportAccess) //TODO: uncomment if data ready
	//	SortTreeBySortType(resp, in.SortType)
	//default: //ต่างจังหวัด
	resp, err = service.adminReportStorage.GetTreeDistrict(in.Province, in.StartDate, in.EndDate)
	//resp = FilterTreeByAccess(resp, in.ReportAccess) //TODO: uncomment if data ready
	SortTreeBySortType(resp, in.SortType)
	//}

	if err != nil {
		return nil, err
	}

	//recursive function until no children
	var recursiveFunc func(children []constant.TreeDistrictData) ([]constant.TreeDistrictData, error)
	recursiveFunc = func(children []constant.TreeDistrictData) ([]constant.TreeDistrictData, error) {
		for j, child := range children {
			grandChildren, err := service.GetTreeRepeat(in, child)
			//resp = FilterTreeByAccess(resp, in.ReportAccess) //TODO: uncomment if data ready
			SortTreeBySortType(grandChildren, in.SortType)
			if err != nil {
				return nil, err
			}
			children[j].Children = grandChildren
			if len(grandChildren) > 0 {
				_, err := recursiveFunc(grandChildren)
				if err != nil {
					return nil, err
				}
			}
		}
		return children, nil
	}

	//replace resp
	_, err = recursiveFunc(resp)
	if err != nil {
		return nil, err
	}

	resp = FilterTreeByAccess(resp, in.ReportAccess) //TODO: uncomment if data ready

	return resp, nil
}

func (service *serviceStruct) GetTreeRepeat(in *ReportCompareProvinceDistrictInput, tree constant.TreeDistrictData) ([]constant.TreeDistrictData, error) {

	var resp []constant.TreeDistrictData
	var err error

	switch tree.Type {
	case "DistrictZone":
		resp, err = service.adminReportStorage.GetTreeDistrictBkk(tree.Name, in.StartDate, in.EndDate)
	case "District":
		resp, err = service.adminReportStorage.GetTreeSchool(in.Province, tree.Name, in.StartDate, in.EndDate)
	case "School":
		resp, err = service.adminReportStorage.GetTreeAcademicYear(tree.SchoolId, in.StartDate, in.EndDate)
	case "AcademicYear":
		resp, err = service.adminReportStorage.GetTreeYear(tree.SchoolId, in.StartDate, in.EndDate, tree.AcademicYear)
	case "Year":
		resp, err = service.adminReportStorage.GetTreeClassRoom(tree.SchoolId, tree.Name, in.StartDate, in.EndDate, tree.AcademicYear)
	case "ClassRoom":
		resp, err = service.adminReportStorage.GetTreeStudent(tree.ClassRoomId, in.StartDate, in.EndDate)
	case "Student":
		resp = []constant.TreeDistrictData{}
	default:
		resp = []constant.TreeDistrictData{}
	}

	return resp, err
}

func SortTreeBySortType(input []constant.TreeDistrictData, sortType string) {
	switch sortType {
	case "avg_star_count":
		sort.Slice(input, func(i, j int) bool {
			return input[i].AvgStarCount > input[j].AvgStarCount
		})
	case "avg_pass_level":
		sort.Slice(input, func(i, j int) bool {
			return input[i].AvgPassLevel > input[j].AvgPassLevel
		})
	case "max_star_count":
		sort.Slice(input, func(i, j int) bool {
			return input[i].MaxStarCount > input[j].MaxStarCount
		})
	default:
		if len(input) > 0 && input[0].ClassRoomId != 0 {
			return
		}
		sort.Slice(input, func(i, j int) bool {
			return input[i].Name < input[j].Name
		})
	}
}

func FilterTreeByAccess(input []constant.TreeDistrictData, reportAccess *constant2.ReportAccessSimplify) []constant.TreeDistrictData {
	if reportAccess.CanAccessAll {
		return input
	}
	newValue := []constant.TreeDistrictData{}
	for _, tree := range input {
		switch tree.Type {
		case "DistrictZone":
			if slices.Contains(reportAccess.DistrictZones, tree.Name) {
				newValue = append(newValue, tree)
			}
			for _, district := range tree.Children {
				if slices.Contains(reportAccess.Districts, district.Name) {
					newValue = append(newValue, tree)
				}
				for _, school := range district.Children {
					if slices.Contains(reportAccess.SchoolIds, school.SchoolId) {
						newValue = append(newValue, tree)
					}
				}
			}
		case "District":
			if slices.Contains(reportAccess.Districts, tree.Name) {
				newValue = append(newValue, tree)
			}
			for _, school := range tree.Children {
				if slices.Contains(reportAccess.SchoolIds, school.SchoolId) {
					newValue = append(newValue, tree)
				}
			}
		case "School":
			if slices.Contains(reportAccess.SchoolIds, tree.SchoolId) {
				newValue = append(newValue, tree)
			}
		default:
			newValue = append(newValue, tree)
		}
	}

	return newValue
}
