package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"

func (postgresRepository *postgresRepository) AddRewardCoinItem(req constant.AddRewardCoinRequest) error {
	query := `
	INSERT INTO "announcement"."announcement_reward_coin"
	(
	announcement_reward_id,
	gold_coin_amount,
	arcade_coin_amount,
	ice_amount
	)VALUES($1,$2,$3,$4);

	`
	_, err := postgresRepository.Database.Exec(query, req.AnnnouncementId, req.GoldCoin, req.ArcadeCoin, req.Ice)
	if err != nil {
		return err
	}

	return nil
}
