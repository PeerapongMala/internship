package postgres

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) SubLessonFileStatusTxUpdate(tx *sqlx.Tx, subLessonIds []int, status bool, userId string) error {
	if len(subLessonIds) == 0 {
		return nil
	}

	var queryMethod func(query string, args ...any) (sql.Result, error)
	if tx == nil {
		queryMethod = postgresRepository.Database.Exec
	} else {
		queryMethod = tx.Exec
	}

	query := `
		INSERT INTO "subject"."sub_lesson_file_status" (
			"sub_lesson_id",
			"is_updated",
			"updated_by"
		)
		SELECT 
			unnest($1::integer[]),
			$2,
			$3
		ON CONFLICT ("sub_lesson_id")
		DO UPDATE SET
			"is_updated" = EXCLUDED."is_updated",
			"updated_by" = EXCLUDED."updated_by"
	`

	_, err := queryMethod(query, subLessonIds, status, userId)
	if err != nil {
		return err
	}

	return nil
}
