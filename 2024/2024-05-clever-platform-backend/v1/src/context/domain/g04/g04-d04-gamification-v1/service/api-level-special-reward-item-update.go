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

type LevelSpecialRewardItemUpdateRequest struct {
	LevelId                  int  `params:"levelId" validate:"required"`
	LevelSpecialRewardItemId int  `params:"levelSpecialRewardId" validate:"required"`
	Amount                   *int `json:"amount" validate:"required"`
}

// ==================== Response ==========================

type LevelSpecialRewardItemUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelSpecialRewardItemUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelSpecialRewardItemUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.LevelSpecialRewardItemUpdate(&LevelSpecialRewardItemUpdateInput{
		SubjectId:                           subjectId,
		LevelSpecialRewardItemUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelSpecialRewardItemUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Updated",
	})
}

// ==================== Service ==========================

type LevelSpecialRewardItemUpdateInput struct {
	SubjectId string
	*LevelSpecialRewardItemUpdateRequest
}

func (service *serviceStruct) LevelSpecialRewardItemUpdate(in *LevelSpecialRewardItemUpdateInput) error {
	err := service.CheckLevelStatus(&CheckLevelStatusInput{
		in.LevelId,
	})
	if err != nil {
		return err
	}

	tx, err := service.gamificationStorage.BeginTx()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	defer tx.Rollback()

	err = service.gamificationStorage.LevelSpecialRewardItemUpdate(tx, in.LevelSpecialRewardItemId, *in.Amount, in.LevelId)
	if err != nil {
		return err
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
