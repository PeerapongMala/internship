package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertCoupon(tx *sqlx.Tx, entity *constant.CouponEntity) (insertId int, err error) {
	
	query := `
		INSERT INTO coupon.coupon (
		  "code",
			"started_at",
			"ended_at",
			"initial_stock",
			"stock",
			"avatar_id",
			"pet_id",	
			"gold_coin_amount",
			"arcade_coin_amount",
			"ice_amount",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by"	
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)	
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.Code,
		entity.StartedAt,
		entity.EndedAt,	
		entity.InitialStock,	
		entity.Stock,	
		entity.AvatarId,
		entity.PetId,	
		entity.GoldCoinAmount,	
		entity.ArcadeCoinAmount,
		entity.IceAmount,
		entity.Status,
		entity.CreatedAt,
		entity.CreatedBy,
		entity.UpdatedAt,
		entity.UpdatedBy,
	).Scan(&insertId)
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
