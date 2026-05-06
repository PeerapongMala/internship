package postgres

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectTeacherGet(teacherId string) ([]constant.Subject, error) {
	query := `
		SELECT
		    "s"."id" AS "id",
		    "s"."name" AS "name",
			"y"."id" AS "year",
			"sy"."short_name" AS "year_name"
		FROM "subject"."subject_teacher" st
		INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
		INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		WHERE "teacher_id" = $1
		ORDER BY "academic_year" DESC
	`
	subjects := []constant.Subject{}
	err := postgresRepository.Database.Select(&subjects, query, teacherId)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("%+v", errors.WithStack(err))
		return subjects, err
	}
	return subjects, nil
}
