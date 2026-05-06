package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) UserInventoryUpdate(userId string, req constant.CoinInfo) error {
	query :=
		`
	UPDATE "inventory"."inventory"
	SET gold_coin = $1,
	arcade_coin = $2,
	Ice = $3
	WHERE student_id = $4
	`
	_, err := postgresRepository.Database.Exec(query,
		req.GoldCoin,
		req.ArcadeCoin,
		req.Ice,
		userId,
	)
	if err != nil {
		return err
	}
	return nil
}
