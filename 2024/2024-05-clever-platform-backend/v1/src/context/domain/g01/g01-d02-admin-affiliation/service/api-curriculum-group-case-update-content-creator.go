package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"slices"
)

// ==================== Request ==========================

type CurriculumGroupCaseUpdateContentCreatorRequest struct {
	Action            int      `json:"action" validate:"required"`
	ContentCreatorIds []string `json:"content_creator_ids" validate:"required"`
}

// ==================== Response ==========================

type CurriculumGroupCaseUpdateContentCreatorResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupCaseUpdateContentCreators(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))

	}
	request, err := helper.ParseAndValidateRequest(context, &CurriculumGroupCaseUpdateContentCreatorRequest{})
	if err != nil || !slices.Contains([]int{1, 2}, request.Action) {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.CurriculumGroupCaseUpdateContentCreator(&CurriculumGroupCaseUpdateContentCreatorInput{
		Action:            request.Action,
		CurriculumGroupId: curriculumGroupId,
		ContentCreatorIds: request.ContentCreatorIds,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CurriculumGroupCaseUpdateContentCreatorResponse{
		StatusCode: http.StatusOK,
		Message:    "Updated",
	})
}

// ==================== Service ==========================

type CurriculumGroupCaseUpdateContentCreatorInput struct {
	Action            int
	CurriculumGroupId int
	ContentCreatorIds []string
}

func (service *serviceStruct) CurriculumGroupCaseUpdateContentCreator(in *CurriculumGroupCaseUpdateContentCreatorInput) error {
	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, id := range in.ContentCreatorIds {
		if in.Action == 1 {
			err := service.schoolAffiliationStorage.CurriculumGroupCaseAddContentCreator(tx, in.CurriculumGroupId, id)
			if err != nil {
				return err
			}
		}
		if in.Action == 2 {
			err := service.schoolAffiliationStorage.CurriculumGroupCaseRemoveContentCreator(tx, in.CurriculumGroupId, id)
			if err != nil {
				return err
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
