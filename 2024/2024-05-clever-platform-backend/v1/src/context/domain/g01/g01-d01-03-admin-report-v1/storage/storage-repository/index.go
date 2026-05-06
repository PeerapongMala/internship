package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
)

type Repository interface {
	GetSchoolStatsByProvinceAndDistrict(province, district string, academicYear []int) (*constant.SchoolStatsEntity, error)
	GetStatPlayCountByProvinceDistrict(province, district, startDate, endDate string) (*constant.StatPlayCountEntity, error)
	GetStatPlayCountAll(startDate, endDate, district string) (*constant.StatPlayCountEntity, error)
	GetAvgStatBKK(startDate, endDate string) ([]constant.AvgStatByProvinceEntity, error)
	GetAvgStatByProvince(province, startDate, endDate string) ([]constant.AvgStatByProvinceEntity, error)

	GetTreeDistrictZoneBkk(startDate, endDate string) ([]constant.TreeDistrictData, error)
	GetTreeDistrictBkk(districtZone, startDate, endDate string) ([]constant.TreeDistrictData, error)
	GetTreeDistrict(province, startDate, endDate string) ([]constant.TreeDistrictData, error)
	GetTreeSchool(province, district, startDate, endDate string) ([]constant.TreeDistrictData, error)
	GetTreeAcademicYear(schoolId int, startDate, endDate string) ([]constant.TreeDistrictData, error)
	GetTreeClassRoom(schoolId int, year, startDate, endDate string, academicYear int) ([]constant.TreeDistrictData, error)
	GetTreeYear(schoolId int, startDate, endDate string, academicYear int) ([]constant.TreeDistrictData, error)
	GetTreeStudent(classRoomId int, startDate, endDate string) ([]constant.TreeDistrictData, error)
}
