package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateCoinAmount(req constant.CoinDelete, announceId int) error {
	query := `
	UPDATE "announcement"."announcement_reward_coin"
	SET
	`
	argI := 1
	args := []interface{}{}
	if req.CoinType == "gold_coin" {
		query += fmt.Sprintf(` gold_coin_amount = $%d`, argI)
		args = append(args, 0)
	}
	if req.CoinType == "arcade_coin" {
		query += fmt.Sprintf(` arcade_coin_amount = $%d`, argI)
		args = append(args, 0)
	}
	if req.CoinType == "ice" {
		query += fmt.Sprintf(` ice_amount = $%d`, argI)
		args = append(args, 0)
	}
	query += fmt.Sprintf(` WHERE announcement_reward_id = $%d`, argI+1)
	args = append(args, announceId)
	_, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		return err
	}
	return nil
}
