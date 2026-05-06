package postgres

import (
	"log"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UpdateCoupon(tx *sqlx.Tx, entity *constant.CouponEntity) error {
	query := "UPDATE coupon.coupon SET "
	params := []interface{}{}
	paramID := 1

	if entity.Code != nil && *entity.Code != "" {
		query += `"code" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.Code)
		paramID++
	}

	if entity.StartedAt != nil {
		query += `"started_at" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.StartedAt)
		paramID++
	}

	if entity.EndedAt != nil {
		query += `"ended_at" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.EndedAt)
		paramID++
	}

	if entity.InitialStock != nil && *entity.InitialStock != 0 {
		query += `"initial_stock" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.InitialStock)
		paramID++
	}

	if entity.Stock != nil && *entity.Stock != 0 {
		query += `"stock" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.Stock)
		paramID++
	}

	if entity.AvatarId != nil && *entity.AvatarId != 0 {
		query += `"avatar_id" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.AvatarId)
		paramID++
	}

	if entity.PetId != nil && *entity.PetId != 0 {
		query += `"pet_id" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.PetId)
		paramID++
	}

	if entity.GoldCoinAmount != nil && *entity.GoldCoinAmount != 0 {
		query += `"gold_coin_amount" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.GoldCoinAmount)
		paramID++
	}

	if entity.ArcadeCoinAmount != nil && *entity.ArcadeCoinAmount != 0 {
		query += `"arcade_coin_amount" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.ArcadeCoinAmount)
		paramID++
	}

	if entity.IceAmount != nil && *entity.IceAmount != 0 {
		query += `"ice_amount" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.IceAmount)
		paramID++
	}

	if entity.Status != nil && *entity.Status != "" {
		query += `"status" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.Status)
		paramID++
	}


	query += `"updated_at" = $` + strconv.Itoa(paramID) + `, `
	params = append(params, entity.UpdatedAt)
	paramID++

	query += `"updated_by" = $` + strconv.Itoa(paramID)
	params = append(params, entity.UpdatedBy)
	paramID++
	
	query += ` WHERE "id" = $` + strconv.Itoa(paramID)
	params = append(params, entity.Id)

	_, err := tx.Exec(query, params...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
