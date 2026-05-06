package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) RewardLogCreate(tx *sqlx.Tx, logs []constant.RewardLog) error {
	if len(logs) == 0 {
		return nil
	}

	args := []interface{}{}
	query := []string{}
	for i, log := range logs {
		query = append(query, fmt.Sprintf(` ($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)`, i*13+1, i*13+2, i*13+3, i*13+4, i*13+5, i*13+6, i*13+7, i*13+8, i*13+9, i*13+10, i*13+11, i*13+12, i*13+13))
		args = append(args, log.UserId, log.GoldCoinAmount, log.ArcadeCoinAmount, log.IceAmount, log.ItemId, log.ItemAmount, log.AvatarId, log.AvatarAmount, log.PetId, log.PetAmount, log.Description, log.ReceivedAt, log.CreatedAt)
	}

	baseQuery := fmt.Sprintf(`
		INSERT INTO "reward"."reward_log" (
			"user_id",
			"gold_coin_amount",
			"arcade_coin_amount",
			"ice_amount",
			"item_id",
			"item_amount",
			"avatar_id",
			"avatar_amount",
			"pet_id",
			"pet_amount",
			"description",
			"received_at",
			"created_at"
		)
		VALUES %s
	`, strings.Join(query, ","))

	_, err := postgresRepository.Database.Exec(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
