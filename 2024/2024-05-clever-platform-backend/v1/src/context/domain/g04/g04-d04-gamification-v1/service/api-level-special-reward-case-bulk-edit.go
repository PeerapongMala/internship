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

type LevelSpecialRewardCaseBulkEditRequest struct {
	LevelIds []int `json:"level_ids" validate:"required"`
	ItemIds  []int `json:"item_ids" validate:"required"`
	Amount   int   `json:"amount" validate:"required"`
}

// ==================== Response ==========================

type LevelSpecialRewardCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelSpecialRewardCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelSpecialRewardCaseBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.LevelSpecialRewardCaseBulkEdit(&LevelSpecialRewardCaseBulkEditInput{
		SubjectId:                             subjectId,
		LevelSpecialRewardCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelSpecialRewardCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type LevelSpecialRewardCaseBulkEditInput struct {
	SubjectId string
	*LevelSpecialRewardCaseBulkEditRequest
}

func (service *serviceStruct) LevelSpecialRewardCaseBulkEdit(in *LevelSpecialRewardCaseBulkEditInput) error {
	tx, err := service.gamificationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, levelId := range in.LevelIds {
		err := service.CheckLevelStatus(&CheckLevelStatusInput{
			levelId,
		})
		if err != nil {
			return err
		}

		for _, itemId := range in.ItemIds {
			err := service.gamificationStorage.LevelSpecialRewardCreate(tx, &constant.LevelSpecialRewardEntity{
				LevelId: levelId,
				ItemId:  itemId,
				Amount:  in.Amount,
			})
			if err != nil {
				return err
			}

		}

		now := time.Now().UTC()
		err = service.gamificationStorage.LevelUpdate(tx, &constant.LevelEntity{
			Id:        levelId,
			UpdatedAt: &now,
			UpdatedBy: &in.SubjectId,
		})
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
