package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonGet(tx *sqlx.Tx, lessonId int) (*constant.LessonDataEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx == nil {
		QueryMethod = postgresRepository.Database.QueryRowx
	} else {
		QueryMethod = tx.QueryRowx
	}

	query := `
		SELECT
			"l"."id",
			"l"."subject_id",
			"s"."name" AS "subject_name",
			"y"."id" AS "year_id",
			"sy"."name" AS "year_name",
			"l"."index",
			"l"."name",
			"l"."font_name",
			"l"."font_size",
			"l"."background_image_path",
			"l"."status",
			"l"."wizard_index",
			"l"."created_at",
			"l"."created_by",
			"l"."updated_at",
			"u"."first_name" AS "updated_by",
			"l"."admin_login_as"
		FROM 
			"subject"."lesson" l	
		LEFT JOIN
			"user"."user" u
			ON "l"."updated_by" = "u"."id"
		LEFT JOIN
			"subject"."subject" s
			ON "l"."subject_id" = "s"."id"
		LEFT JOIN
			"curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
			"curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN
			"curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"l"."id" = $1
	`
	lessonDataEntity := constant.LessonDataEntity{}
	err := QueryMethod(query, lessonId).StructScan(&lessonDataEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	lessonCountQuery := `
		SELECT
			COUNT(*) AS "sub_lesson_count"
		FROM
			"subject"."sub_lesson"	
		WHERE
			"lesson_id" = $1
			AND
			"status" = $2
	`
	err = QueryMethod(lessonCountQuery, lessonId, constant.Enabled).Scan(&lessonDataEntity.SubLessonCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &lessonDataEntity, nil
}
