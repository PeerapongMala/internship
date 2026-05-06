package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"

func (postgresRepository *postgresRepository) CoinList(announceId int) (*constant.CoinList, error) {
	query := `
	SELECT
	gold_coin_amount  AS "gold_coin",
	arcade_coin_amount AS "arcade_coin",
	ice_amount AS "ice"
	FROM "announcement"."announcement_reward_coin"
	WHERE announcement_reward_id = $1
		`
	row := postgresRepository.Database.QueryRow(query, announceId)

	response := constant.CoinList{}
	err := row.Scan(
		&response.Goldcoin,
		&response.ArcadeCoin,
		&response.Ice,
	)
	if err != nil {
		return nil, err
	}
	return &response, nil
}
