package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LessonPrefill(tx *sqlx.Tx, subjectId, lessonId int, isExtra bool) error {
	query := `
		WITH "target_class" AS (
			SELECT
				"c"."id",
				"c"."school_id"
			FROM "subject"."subject" s
			INNER JOIN "school_affiliation"."contract_subject_group" csg ON "s"."subject_group_id" = "csg"."subject_group_id"
			INNER JOIN "school_affiliation"."contract_school" cs ON "csg"."contract_id" = "cs"."contract_id"
			INNER JOIN "class"."class" c ON "cs"."school_id" = "c"."school_id"
			WHERE "s"."id" = $1	
		)
		INSERT INTO "school"."school_lesson" (
			"school_id",
			"lesson_id",
			"class_id",
			"is_enabled"
		)	
		SELECT
			"tc"."school_id",
			$2,
			"tc"."id",
			$3
		FROM "target_class" tc
		ON CONFLICT DO NOTHING
	`
	_, err := tx.Exec(query, subjectId, lessonId, !isExtra)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
