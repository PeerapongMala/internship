package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
)

func (postgresRepository *postgresRepository) RewardLogCreate(req constant.RewardLogRequest) error {
	query := `
 INSERT INTO "reward"."reward_log"(
  user_id,
  gold_coin_amount,
  arcade_coin_amount,
  ice_amount,
  item_id,
  item_amount,
  description,
  received_at,
  created_at


 )VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)

 `
	currentTime := time.Now().UTC().Format("2006-01-02")
	_, err := postgresRepository.Database.Exec(query,
		req.UserId,
		req.GoldCoinAmount,
		req.ArcadeCoinAmount,
		req.IceAmount,
		req.ItemId,
		req.ItemAmount,
		"mail-box",
		currentTime,
		currentTime,
	)
	if err != nil {
		return err
	}
	return nil

}
