package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) GetUserCoin(userId string) (*constant.CoinInfo, error) {
	query := `
	SELECT 
	gold_coin,
	arcade_coin,
	ice
	FROM "inventory"."inventory"
	WHERE student_id = $1

	`
	row := postgresRepository.Database.QueryRow(query, userId)
	response := constant.CoinInfo{}

	err := row.Scan(
		&response.GoldCoin,
		&response.ArcadeCoin,
		&response.Ice,
	)
	if err != nil {
		return nil, err
	}
	return &response, nil
}
