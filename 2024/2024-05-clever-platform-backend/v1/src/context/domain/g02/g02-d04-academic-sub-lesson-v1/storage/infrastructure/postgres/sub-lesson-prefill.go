package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonPrefill(tx *sqlx.Tx, lessonId, subLessonId int) error {
	query := `
		WITH "target_class" AS (
			SELECT
				"c"."id",
				"c"."school_id"
			FROM "subject"."lesson" l
			INNER JOIN "subject"."subject" s ON "l"."subject_id" = "s"."id"
			INNER JOIN "school_affiliation"."contract_subject_group" csg ON "s"."subject_group_id" = "csg"."subject_group_id"
			INNER JOIN "school_affiliation"."contract_school" cs ON "csg"."contract_id" = "cs"."contract_id"
			INNER JOIN "class"."class" c ON "cs"."school_id" = "c"."school_id"
			WHERE "l"."id" = $1	
		)
		INSERT INTO "school"."school_sub_lesson" (
			"school_id",
			"sub_lesson_id",
			"class_id",
			"is_enabled"
		)	
		SELECT
			"tc"."school_id",
			$2,
			"tc"."id",
			TRUE
		FROM "target_class" tc
		ON CONFLICT DO NOTHING
	`
	_, err := tx.Exec(query, lessonId, subLessonId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
