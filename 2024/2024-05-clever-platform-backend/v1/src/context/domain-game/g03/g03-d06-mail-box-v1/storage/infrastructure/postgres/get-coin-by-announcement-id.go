package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) GetCoinInfoByAnnouncementId(announceId int) (*constant.CoinInfo, error) {
	query := `
	SELECT
	gold_coin_amount,
	arcade_coin_amount,
	ice_amount
	FROM "announcement"."announcement_reward_coin"
	WHERE announcement_reward_id = $1
	`

	row := postgresRepository.Database.QueryRow(query, announceId)

	response := constant.CoinInfo{}

	err := row.Scan(
		&response.GoldCoin,
		&response.ArcadeCoin,
		&response.Ice,
	)
	if err != nil {
		return nil, err
	}
	// if &response.GoldCoin == nil {
	// 	response.GoldCoin = 0
	// }
	// if &response.ArcadeCoin == nil {
	// 	response.ArcadeCoin = 0
	// }
	// if &response.Ice == nil {
	// 	response.Ice = 0
	// }

	return &response, nil
}
