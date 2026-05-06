package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelSpecialRewardCreate(tx *sqlx.Tx, levelSpecialReward *constant.LevelSpecialRewardEntity) error {
	query := `
		INSERT INTO "level"."level_special_reward" (
			"level_id",
			"item_id",
			"amount"
		)	
		VALUES ($1, $2, $3)
		ON CONFLICT ("level_id", "item_id")
		DO UPDATE SET
			"amount" = "level_special_reward"."amount" + EXCLUDED."amount"
	`
	_, err := tx.Exec(
		query,
		levelSpecialReward.LevelId,
		levelSpecialReward.ItemId,
		levelSpecialReward.Amount,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
