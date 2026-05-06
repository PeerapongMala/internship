package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ===========================

type LevelSpecialRewardItemCaseBulkEditRequest struct {
	LevelId               int   `params:"levelId" validate:"required"`
	LevelSpecialRewardIds []int `json:"level_special_reward_ids" validate:"required"`
}

// ==================== Response ==========================

type LevelSpecialRewardItemCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelSpecialRewardItemCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelSpecialRewardItemCaseBulkEditRequest{}, helper.ParseOptions{Body: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.LevelSpecialRewardItemCaseBulkEdit(&LevelSpecialRewardItemCaseBulkEditInput{
		SubjectId: subjectId,
		LevelSpecialRewardItemCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelSpecialRewardItemCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type LevelSpecialRewardItemCaseBulkEditInput struct {
	SubjectId string
	*LevelSpecialRewardItemCaseBulkEditRequest
}

func (service *serviceStruct) LevelSpecialRewardItemCaseBulkEdit(in *LevelSpecialRewardItemCaseBulkEditInput) error {
	tx, err := service.gamificationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.CheckLevelStatus(&CheckLevelStatusInput{
		in.LevelId,
	})
	if err != nil {
		return err
	}

	for _, levelSpecialRewardId := range in.LevelSpecialRewardIds {
		err := service.gamificationStorage.LevelSpecialRewardDelete(tx, levelSpecialRewardId, in.LevelId)
		if err != nil {
			return err
		}
	}

	now := time.Now().UTC()
	err = service.gamificationStorage.LevelUpdate(tx, &constant.LevelEntity{
		Id:        in.LevelId,
		UpdatedAt: &now,
		UpdatedBy: &in.SubjectId,
	})
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
