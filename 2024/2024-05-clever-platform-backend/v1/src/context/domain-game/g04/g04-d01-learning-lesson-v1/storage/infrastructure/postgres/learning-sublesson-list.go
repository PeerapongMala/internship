package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ListLearningSublesson(pagination *helper.Pagination, lessonId int, userId string) (*[]constant.LearningSublessonList, error) {
	response := []constant.LearningSublessonList{}
	query := `
		WITH current_class AS (
			SELECT
				"c"."id"
			FROM "user"."student" s
			LEFT JOIN "school"."class_student" cs ON "cs"."student_id" = "s"."user_id"
			LEFT JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
			WHERE
				"s"."user_id" = $3
				AND "c"."academic_year" = (
					SELECT
						MAX("c2"."academic_year")
					FROM "user"."student" s2
					LEFT JOIN "school"."class_student" cs2 ON "cs2"."student_id" = "s2"."user_id"
					LEFT JOIN "class"."class" c2 ON "cs2"."class_id" = "c2"."id"
					WHERE
						"s2"."user_id" = $3
				)
		)
		SELECT DISTINCT ON ("sl"."id")
			"sl"."id",
			"sl"."lesson_id",
			"sl"."index",
			"sl"."indicator_id",
			"sl"."name",
			"sl"."status",
			"sl"."created_at",
			"uc"."first_name" AS "created_by",
			"slfs"."updated_at",
			"uu"."first_name" AS "updated_by",
			"sl"."admin_login_as",
			"ind"."name" AS "indicator_name"
		FROM "class"."class" c
		LEFT JOIN "school"."school_sub_lesson" ssl ON "c"."id" = "ssl"."class_id"
		LEFT JOIN "subject"."sub_lesson" sl ON "ssl"."sub_lesson_id" = "sl"."id"
		LEFT JOIN "subject"."sub_lesson_file_status" slfs ON "sl"."id" = "slfs"."sub_lesson_id"
		LEFT JOIN "user"."user" uu ON "slfs"."updated_by" = "uu"."id"
		LEFT JOIN "user"."user" uc ON "sl"."created_by" = "uc"."id"
		LEFT JOIN "curriculum_group"."indicator" ind ON "sl"."indicator_id" = "ind"."id"
		LEFT JOIN "current_class" cc ON "c"."id" = "cc"."id"
		WHERE
			"sl"."lesson_id" = $1
			AND "sl"."status" = $2
			AND "cc"."id" = "c"."id"
			AND "ssl"."is_enabled" = TRUE
	`
	// log.Println("query", query)
	args := []interface{}{lessonId, constant.Enabled, userId}
	argsIndex := len(args) + 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}
	err := postgresRepository.Database.Select(&response, query, args...)
	// log.Println("response", response)
	// log.Println("err", err)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &response, nil
}
