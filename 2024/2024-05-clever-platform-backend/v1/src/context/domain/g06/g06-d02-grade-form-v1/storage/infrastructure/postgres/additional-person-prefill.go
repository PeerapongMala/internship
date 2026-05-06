package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) AdditionalPersonPrefill(tx *sqlx.Tx, formId int, teacherId string) error {
	query := `
		WITH school_id AS (
			SELECT "school_id"
			FROM "school"."school_teacher"
			WHERE "user_id" = $1
			LIMIT 1
		),
		"target_subject_teachers" AS (
			SELECT
				"ts"."id",
				"st"."teacher_id"
			FROM "grade"."evaluation_form" ef
			INNER JOIN "grade"."template" t ON "ef"."template_id" = "t"."id"
			INNER JOIN "grade"."template_subject" ts ON "t"."id" = "ts"."template_id" 
			INNER JOIN "subject"."subject_teacher" st ON "ts"."clever_subject_id" = "st"."subject_id"
			INNER JOIN "school"."school_teacher" st2 ON "st"."teacher_id" = "st2"."user_id"
			INNER JOIN "school_id" si ON "st2"."school_id" = "si"."school_id"
			WHERE "ef"."id" = $2
		)
		INSERT INTO "grade"."evaluation_form_additional_person" ("form_id", "value_type", "value_id", "user_type", "user_id")
		SELECT
			$2,
			'SUBJECT',
			"id",
			'teacher',
			"teacher_id"
		FROM "target_subject_teachers"
		ON CONFLICT ("form_id", "value_type", "value_id", "user_type", "user_id") DO NOTHING
	`
	_, err := tx.Exec(query, teacherId, formId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
