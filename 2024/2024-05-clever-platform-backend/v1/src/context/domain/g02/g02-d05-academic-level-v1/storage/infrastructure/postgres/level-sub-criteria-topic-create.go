package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelSubCriteriaTopicCreate(tx *sqlx.Tx, subCriteriaTopicId, levelId int) error {
	query := `
		INSERT INTO "level"."level_sub_criteria_topic" (
			"level_id",
			"sub_criteria_topic_id"
		)
		VALUES ($1, $2)
	`
	_, err := tx.Exec(query, levelId, subCriteriaTopicId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
