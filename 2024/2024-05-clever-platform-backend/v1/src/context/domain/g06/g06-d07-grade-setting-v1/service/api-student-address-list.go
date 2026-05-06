package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentAddressListRequest struct {
	constant.GradeEvaluationStudentFilter
	Pagination *helper.Pagination
}

// ==================== Response ==========================

type StudentAddressListResponse struct {
	StatusCode int                             `json:"status_code"`
	Pagination *helper.Pagination              `json:"_pagination"`
	Data       []constant.StudentAddressResult `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) StudentAddressList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentAddressListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request.Pagination = helper.PaginationNew(context)

	output, err := api.Service.StudentAddressList(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentAddressListResponse{
		StatusCode: http.StatusOK,
		Pagination: request.Pagination,
		Data:       output,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) StudentAddressList(in *StudentAddressListRequest) ([]constant.StudentAddressResult, error) {
	list, err := service.gradeSettingStorage.GradeEvaluationStudentList(in.GradeEvaluationStudentFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	result := []constant.StudentAddressResult{}
	for _, v := range list {
		result = append(result, constant.StudentAddressResult{
			ID:                 v.ID,
			FormID:             v.FormID,
			CitizenNo:          v.CitizenNo,
			StudentID:          v.StudentID,
			Gender:             v.Gender,
			Title:              v.Title,
			ThaiFirstName:      v.ThaiFirstName,
			ThaiLastName:       v.ThaiLastName,
			EngFirstName:       v.EngFirstName,
			EngLastName:        v.EngLastName,
			AddressNo:          v.AddressNo,
			AddressMoo:         v.AddressMoo,
			AddressSubDistrict: v.AddressSubDistrict,
			AddressDistrict:    v.AddressDistrict,
			AddressProvince:    v.AddressProvince,
			AddressPostalCode:  v.AddressPostalCode,
		})
	}
	return result, nil
}
