package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateRewardCoinItem(req constant.UpdateRewardCoinRequest) error {
	if req.Ice == nil && req.ArcadeCoin == nil && req.GoldCoin == nil {
		return nil
	}

	query := `
	UPDATE "announcement"."announcement_reward_coin"
	SET 

	`
	args := []interface{}{}
	argI := 1
	comma := ""

	if req.GoldCoin != nil {
		query += fmt.Sprintf(`%s gold_coin_amount = $%d`, comma, argI)
		args = append(args, req.GoldCoin)
		argI++
		comma = " ,"
	}
	if req.ArcadeCoin != nil {
		query += fmt.Sprintf(`%s arcade_coin_amount = $%d`, comma, argI)
		args = append(args, req.ArcadeCoin)
		argI++
		comma = " ,"
	}
	if req.Ice != nil {
		query += fmt.Sprintf(`%s ice_amount = $%d`, comma, argI)
		args = append(args, req.Ice)
		argI++
		comma = " ,"
	}
	query += fmt.Sprintf(`    WHERE announcement_reward_id = $%d`, argI)
	args = append(args, req.AnnnouncementId)
	argI++
	log.Print(query)
	_, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		return err
	}

	return nil
}
