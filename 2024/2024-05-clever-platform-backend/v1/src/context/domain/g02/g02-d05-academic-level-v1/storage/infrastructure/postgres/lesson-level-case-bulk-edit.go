package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"time"
)

func (postgresRepository *postgresRepository) LessonLevelCaseBulkEdit(tx *sqlx.Tx, lessonIds []int, status, userId string) error {
	query := `
		UPDATE "level"."level" l
		SET "status" = $2,
			"updated_at" = $3,
			"updated_by" = $4
		FROM (
			SELECT
				"l"."id"
			FROM "subject"."lesson" ls
			INNER JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id"
			INNER JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			WHERE ls.id = ANY($1)
		) AS "target_level"
		WHERE "l"."id" = "target_level"."id"
	`
	_, err := tx.Exec(query, lessonIds, status, time.Now().UTC(), userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
