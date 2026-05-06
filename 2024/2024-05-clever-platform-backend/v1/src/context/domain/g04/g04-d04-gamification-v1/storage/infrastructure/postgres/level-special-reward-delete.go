package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelSpecialRewardDelete(tx *sqlx.Tx, levelSpecialRewardId int, levelId int) error {
	query := `
		DELETE FROM
			"level"."level_special_reward"
		WHERE
		    "id" = $1
			AND
		    "level_id" = $2
	`
	_, err := tx.Exec(query, levelSpecialRewardId, levelId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
