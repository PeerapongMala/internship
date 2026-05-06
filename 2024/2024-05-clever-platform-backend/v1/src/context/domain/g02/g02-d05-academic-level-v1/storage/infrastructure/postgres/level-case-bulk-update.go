package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelCaseBulkUpdate(tx *sqlx.Tx, levels map[int]constant.LevelUpdateEntity) error {
	if len(levels) == 0 {
		return nil
	}
	query := `
		UPDATE "level"."level" AS l
		SET "status" = new_level.status
		FROM (
			SELECT UNNEST($1::INT[]) AS id, UNNEST($2::TEXT[]) AS status
		) AS new_level
		WHERE l.id = new_level.id;
	`

	ids := make([]int, len(levels))
	status := make([]string, len(levels))
	i := 0
	for id, level := range levels {
		ids[i] = id
		status[i] = level.Status
		i++
	}

	_, err := tx.Exec(query, ids, status)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
