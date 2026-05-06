package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type CurriculumGroupUpdateRequest struct {
	Name      string `json:"name"`
	ShortName string `json:"short_name"`
	Status    string `json:"status"`
}

// ==================== Response ==========================

type CurriculumGroupUpdateResponse struct {
	StatusCode int                              `json:"status_code"`
	Data       []constant.CurriculumGroupEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupUpdate(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &CurriculumGroupUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	curriculumGroupUpdateOutput, err := api.Service.CurriculumGroupUpdate(&CurriculumGroupUpdateInput{
		SubjectId:                    subjectId,
		CurriculumGroupId:            curriculumGroupId,
		CurriculumGroupUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CurriculumGroupUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.CurriculumGroupEntity{*curriculumGroupUpdateOutput.CurriculumGroupEntity},
		Message:    "Curriculum group updated",
	})
}

// ==================== Service ==========================

type CurriculumGroupUpdateInput struct {
	SubjectId         string
	CurriculumGroupId int
	*CurriculumGroupUpdateRequest
}

type CurriculumGroupUpdateOutput struct {
	*constant.CurriculumGroupEntity
}

func (service *serviceStruct) CurriculumGroupUpdate(in *CurriculumGroupUpdateInput) (*CurriculumGroupUpdateOutput, error) {
	now := time.Now().UTC()
	curriculumGroup, err := service.schoolAffiliationStorage.CurriculumGroupUpdate(nil, &constant.CurriculumGroupEntity{
		Id:        in.CurriculumGroupId,
		Name:      in.Name,
		ShortName: in.ShortName,
		Status:    in.Status,
		UpdatedAt: &now,
		UpdatedBy: &in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	return &CurriculumGroupUpdateOutput{
		curriculumGroup,
	}, nil
}
