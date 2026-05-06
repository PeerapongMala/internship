package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonGet(tx *sqlx.Tx, subLessonId int) (*constant.SubLessonDataEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx == nil {
		QueryMethod = postgresRepository.Database.QueryRowx
	} else {
		QueryMethod = tx.QueryRowx
	}
	query := `
		SELECT
			"sl"."id",
			"s"."id" AS "subject_id",
			"s"."name" AS "subject_name",
			"p"."id" AS "platform_id",
			"y"."id" AS "year_id",
			"sy"."name" AS "year_name",
			"l"."id" AS "lesson_id",
			"sl"."index",
			"indicator"."id" AS indicator_id,
			"indicator"."name" AS indicator_name,
			"sl"."name",
			"sl"."status",
			"sl"."created_at",
			"sl"."created_by",
			"sl"."updated_at",
			"u"."first_name" AS "updated_by",
			"sl"."admin_login_as",
			COALESCE("slfs"."is_updated", false) AS "file_is_updated",
			"slfs"."updated_at" AS "file_updated_at"
		FROM 
			"subject"."sub_lesson" sl
		LEFT JOIN "subject"."sub_lesson_file_status" slfs ON "sl"."id" = "slfs"."sub_lesson_id"
		LEFT JOIN
			"user"."user" u
			ON "sl"."updated_by" = "u"."id"
		LEFT JOIN
			"subject"."lesson" l
			ON "sl"."lesson_id" = "l"."id"
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
		LEFT JOIN
			"curriculum_group"."platform" p
			ON "y"."platform_id" = "p"."id"
		LEFT JOIN
			"curriculum_group"."indicator" indicator
			ON "indicator"."id" = "sl"."indicator_id"
		WHERE
			"sl"."id" = $1
	`
	subLessonDataEntity := constant.SubLessonDataEntity{}
	err := QueryMethod(query, subLessonId).StructScan(&subLessonDataEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	levelCountQuery := `
		SELECT
			COUNT(*) AS "level_count"
		FROM
			"level"."level"
		WHERE
			"sub_lesson_id" = $1	
	`
	err = QueryMethod(levelCountQuery, subLessonId).Scan(&subLessonDataEntity.LevelCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subLessonDataEntity, nil
}
