package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ===========================
type CurriculumGroupCaseListByContentCreatorRequest struct {
	SearchText string `json:"search_text"`
}

// ==================== Response ==========================

type CurriculumGroupCaseListByContentCreatorResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.CurriculumGroupEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) CurriculumGroupCaseListByContentCreator(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	filter := constant.CurriculumGroupFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	CurriculumGroupCaseListByContentCreatorOutput, err := api.Service.CurriculumGroupCaseListByContentCreator(&CurriculumGroupCaseListByContentCreatorInput{
		Roles:      roles,
		SubjectId:  subjectId,
		Pagination: pagination,
		Filter:     &filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CurriculumGroupCaseListByContentCreatorResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       CurriculumGroupCaseListByContentCreatorOutput.CurriculumGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type CurriculumGroupCaseListByContentCreatorInput struct {
	Roles      []int
	SubjectId  string
	Pagination *helper.Pagination
	Filter     *constant.CurriculumGroupFilter
}

type CurriculumGroupCaseListByContentCreatorOutput struct {
	CurriculumGroups []constant.CurriculumGroupEntity
}

func (service *serviceStruct) CurriculumGroupCaseListByContentCreator(in *CurriculumGroupCaseListByContentCreatorInput) (*CurriculumGroupCaseListByContentCreatorOutput, error) {
	log.Println(in.Filter.SearchText)
	log.Println(in.Roles)
	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		in.Filter.ContentCreatorId = in.SubjectId
	}

	curriculumGroups, err := service.arrivingStorage.CurriculumGroupCaseListByContentCreator(in.Pagination, in.Filter)
	if err != nil {
		return nil, err
	}

	return &CurriculumGroupCaseListByContentCreatorOutput{
		CurriculumGroups: curriculumGroups,
	}, nil
}
