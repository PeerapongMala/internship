package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelSpecialRewardItemUpdate(tx *sqlx.Tx, levelSpecialRewardItemId int, amount int, levelId int) error {
	query := `
		UPDATE
			"level"."level_special_reward"
		SET
		    "amount" = $1
		WHERE
		    "id" = $2
			AND
		    "level_id" = $3
	`
	_, err := tx.Exec(query, amount, levelSpecialRewardItemId, levelId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
