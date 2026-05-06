package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertRewardLogs(tx *sqlx.Tx, entity *constant.RewardLogEntity) (insertId int, err error) {

	query := `
		INSERT INTO reward.reward_log
		(user_id, gold_coin_amount, arcade_coin_amount, ice_amount, item_id, item_amount, avatar_id, avatar_amount, pet_id, pet_amount, description, received_at, created_at)
		VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.UserId,
		entity.GoldCoinAmount,
		entity.ArcadeCoinAmount,
		entity.IceAmount,
		entity.ItemId,	
		entity.ItemAmount,
		entity.AvatarId,
		entity.AvatarAmount,
		entity.PetId,
		entity.PetAmount,
		entity.Description,
		entity.ReceivedAt,
		entity.CreatedAt,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
