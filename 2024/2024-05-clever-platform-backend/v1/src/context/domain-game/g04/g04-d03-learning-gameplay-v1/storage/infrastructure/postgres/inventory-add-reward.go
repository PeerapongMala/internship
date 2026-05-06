package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) InventoryAddReward(tx *sqlx.Tx, userId string, rewards []constant.Reward) error {
	if len(rewards) == 0 {
		return nil
	}

	goldCoins := 0
	arcadeCoins := 0
	for _, reward := range rewards {
		goldCoins += *reward.GoldCoins
		arcadeCoins += *reward.ArcadeCoins
	}

	query := `
		UPDATE "inventory"."inventory" SET
			gold_coin = gold_coin + $1,
			arcade_coin = arcade_coin + $2
		WHERE
			"student_id" = $3
	`

	_, err := postgresRepository.Database.Exec(query, goldCoins, arcadeCoins, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
