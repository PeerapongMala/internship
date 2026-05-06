package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"net/http"
	"slices"
)

type ValidateReportScopeInput struct {
	ReportType  string
	Scope       string
	ParentScope string
}

func (service *serviceStruct) ValidateReportScope(in *ValidateReportScopeInput) error {
	if !slices.Contains(constant.ScopeList, in.Scope) {
		msg := `Invalid scope`
		return helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	//isValid := true
	//switch in.Scope {
	//case constant.AreaOffice:
	//	if in.ParentScope == "" {
	//		isValid = false
	//	}
	//case constant.District:
	//	if in.ParentScope == "" {
	//		isValid = false
	//	}
	//case constant.School:
	//	if !slices.Contains([]string{constant.Opec, constant.Others}, in.ReportType) && in.ParentScope == "" {
	//		isValid = false
	//	}
	//}
	//
	//if !isValid {
	//	msg := "Invalid parent scope"
	//	return helper.NewHttpError(http.StatusBadRequest, &msg)
	//}

	return nil
}
