package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelSpecialRewardDelete(tx *sqlx.Tx, levelIds []int) error {
	if len(levelIds) == 0 {
		return nil
	}
	query := `
		DELETE FROM "level"."level_special_reward"
		WHERE "level_id" = ANY($1)
	`
	_, err := tx.Exec(query, levelIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
