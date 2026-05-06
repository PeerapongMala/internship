package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"log"
	"net/http"
	"sort"

	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================
type GeneralTemplateListResponse struct {
	StatusCode int                                `json:"status_code"`
	Data       []constant.GeneralTemplateDropDown `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) DropDownGeneralTemplateList(context *fiber.Ctx) error {

	schoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	output, err := api.Service.DropDownGeneralTemplateList(&GeneralTemplateListInput{
		SchoolId: schoolId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GeneralTemplateListResponse{
		StatusCode: http.StatusOK,
		Data:       output.Output,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type GeneralTemplateListInput struct {
	Pagination *helper.Pagination
	SchoolId   int
}

type GeneralTemplateListOutput struct {
	Output []constant.GeneralTemplateDropDown
}

func (service *serviceStruct) DropDownGeneralTemplateList(in *GeneralTemplateListInput) (*GeneralTemplateListOutput, error) {

	gradeTemplates, err := service.gradeTemplateStorage.GradeGeneralTemplateList(in.SchoolId, "", helper.PaginationDefault())
	if err != nil {
		return nil, err
	}

	resp := []constant.GeneralTemplateDropDown{}
	mappingTypeDetail := map[string][]*constant.GeneralTemplateDropDownDetail{}

	for _, gradeTemplate := range gradeTemplates {
		if gradeTemplate.Id != nil {
			mappingTypeDetail[*gradeTemplate.TemplateType] = append(mappingTypeDetail[*gradeTemplate.TemplateType], &constant.GeneralTemplateDropDownDetail{
				ID:         *gradeTemplate.Id,
				Name:       *gradeTemplate.TemplateName,
				Status:     helper.Deref(gradeTemplate.Status),
				ActiveFlag: helper.Deref(gradeTemplate.ActiveFlag),
			})
		}
	}

	for key, value := range mappingTypeDetail {
		resp = append(resp, constant.GeneralTemplateDropDown{
			TemplateType: key,
			Template:     service.removeTemplateDetailDuplicateName(value),
		})
	}

	return &GeneralTemplateListOutput{
		Output: resp,
	}, nil
}

func (service *serviceStruct) removeTemplateDetailDuplicateName(details []*constant.GeneralTemplateDropDownDetail) []*constant.GeneralTemplateDropDownDetail {
	seen := map[string]bool{}
	result := []*constant.GeneralTemplateDropDownDetail{}

	sort.SliceStable(details, func(i, j int) bool {
		return details[i].ID > details[j].ID
	})
	for _, d := range details {
		if !seen[d.Name] {
			seen[d.Name] = true
			result = append(result, d)
		}
	}

	return result
}
