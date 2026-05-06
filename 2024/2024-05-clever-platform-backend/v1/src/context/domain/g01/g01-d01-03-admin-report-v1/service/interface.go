package service

import (
)

type ServiceInterface interface {
	ReportProvinceDistrict(in *ReportProvinceDistrictInput) (*ReportProvinceDistrictOutput, error)
	ReportCompareProvinceDistrict(in *ReportCompareProvinceDistrictInput) (*ReportCompareProvinceDistrictOutput, error)
}
