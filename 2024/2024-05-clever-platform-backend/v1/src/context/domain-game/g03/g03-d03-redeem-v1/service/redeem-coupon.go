package service

import (
	"errors"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d03-redeem-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================
type RedeemCouponResponse struct {
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) RedeemCoupon(context *fiber.Ctx) error {

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err := api.Service.RedeemCoupon(&RedeemCouponInput{
		UserId:     userId,
		CouponCode: context.Params("couponCode"),
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(RedeemCouponResponse{
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

type RedeemCouponInput struct {
	UserId     string
	CouponCode string
}

func (service *serviceStruct) RedeemCoupon(in *RedeemCouponInput) error {

	//validate 1
	couponEntity, err := service.redeemStorage.CheckCouponIsExist(in.CouponCode)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			err = helper.NewHttpError(http.StatusNotFound, helper.ToPtr("coupon code is not exist"))
		}
		return err
	}

	if couponEntity == nil {
		return errors.New("coupon code is not exist")
	}

	if (couponEntity.Stock != nil && *couponEntity.Stock <= 0) && couponEntity.InitialStock != nil && *couponEntity.InitialStock != -1 {
		return errors.New("coupon out of stock")
	}

	//validate 2
	transactionExist, err := service.redeemStorage.CheckCouponTransactionExist(in.UserId, couponEntity.Id)
	if err != nil {
		return err
	}

	if transactionExist {
		return helper.NewHttpError(http.StatusConflict, helper.ToPtr("coupon already redeemed"))
	}

	//start update
	tx, err := service.redeemStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	now := time.Now()
	//update transaction
	_, err = service.redeemStorage.InsertCouponTransaction(tx, &constant.CouponTransactionEntity{
		CouponId:  couponEntity.Id,
		StudentId: &in.UserId,
		Status:    convertStringPointer("used"),
		UsedAt:    &now,
	})

	if err != nil {
		return err
	}

	//update inventory
	err = service.redeemStorage.UpdateInventory(tx, &constant.InventoryDTO{
		StudentId:  in.UserId,
		ArcadeCoin: HandleIntPointer(couponEntity.ArcadeCoinAmount),
		GoldCoin:   HandleIntPointer(couponEntity.GoldCoinAmount),
		IceAmount:  HandleIntPointer(couponEntity.IceAmount),
		AvatarId:   couponEntity.AvatarId,
		PetId:      couponEntity.PetId,
	})

	if err != nil {
		return err
	}

	//update stock
	err = service.redeemStorage.ReduceCouponStockById(tx, *couponEntity.Id)
	if err != nil {
		return err
	}

	//add reward items to logs
	rewardLogs := CreateRewardLogTransaction(&constant.RewardLogEntity{
		UserId:           &in.UserId,
		GoldCoinAmount:   couponEntity.GoldCoinAmount,
		ArcadeCoinAmount: couponEntity.ArcadeCoinAmount,
		IceAmount:        couponEntity.IceAmount,
		AvatarId:         couponEntity.AvatarId,
		PetId:            couponEntity.PetId,
		Description:      convertStringPointer("coupon"),
		CreatedAt:        &now,
		ReceivedAt:       &now,
	})

	for _, rewardLog := range rewardLogs {
		_, err = service.redeemStorage.InsertRewardLogs(tx, &rewardLog)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func CreateRewardLogTransaction(entity *constant.RewardLogEntity) []constant.RewardLogEntity {

	resp := []constant.RewardLogEntity{}
	if entity.GoldCoinAmount != nil && *entity.GoldCoinAmount != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:         entity.UserId,
			GoldCoinAmount: entity.GoldCoinAmount,
			Description:    entity.Description,
			ReceivedAt:     entity.ReceivedAt,
			CreatedAt:      entity.CreatedAt,
		})
	}

	if entity.ArcadeCoinAmount != nil && *entity.ArcadeCoinAmount != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:           entity.UserId,
			ArcadeCoinAmount: entity.ArcadeCoinAmount,
			Description:      entity.Description,
			ReceivedAt:       entity.ReceivedAt,
			CreatedAt:        entity.CreatedAt,
		})
	}

	if entity.IceAmount != nil && *entity.IceAmount != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:      entity.UserId,
			IceAmount:   entity.IceAmount,
			Description: entity.Description,
			ReceivedAt:  entity.ReceivedAt,
			CreatedAt:   entity.CreatedAt,
		})
	}

	if entity.ItemId != nil && *entity.ItemId != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:      entity.UserId,
			ItemId:      entity.ItemId,
			ItemAmount:  entity.ItemAmount,
			Description: entity.Description,
			ReceivedAt:  entity.ReceivedAt,
			CreatedAt:   entity.CreatedAt,
		})
	}

	if entity.AvatarId != nil && *entity.AvatarId != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:       entity.UserId,
			AvatarId:     entity.AvatarId,
			AvatarAmount: convertIntPointer(1),
			Description:  entity.Description,
			ReceivedAt:   entity.ReceivedAt,
			CreatedAt:    entity.CreatedAt,
		})
	}

	if entity.PetId != nil && *entity.PetId != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:      entity.UserId,
			PetId:       entity.PetId,
			PetAmount:   convertIntPointer(1),
			Description: entity.Description,
			ReceivedAt:  entity.ReceivedAt,
			CreatedAt:   entity.CreatedAt,
		})
	}

	return resp
}

func HandleIntPointer(value *int) int {
	if value == nil {
		return 0
	}
	return *value
}

func convertIntPointer(value int) *int {
	return &value
}

func convertStringPointer(value string) *string {
	return &value
}
