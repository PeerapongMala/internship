package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLearningSublesson(sublessonId int) (*constant.LearningSublessonDataEntity, error) {
	response := constant.LearningSublessonDataEntity{}
	query := `
		SELECT
			"sl"."id",
			"s"."id" AS "subject_id",
			"s"."name" AS "subject_name",
			"y"."id" AS "year_id",
			"sy"."name" AS "year_name",
			"l"."id" AS "lesson_id",
			"sl"."index",
			"sl"."indicator_id",
			"sl"."name",
			"sl"."status",
			"sl"."created_at",
			"sl"."created_by",
			"sl"."updated_at",
			"u"."first_name" AS "updated_by",
			"sl"."admin_login_as"
		FROM 
			"subject"."sub_lesson" sl
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
		WHERE
			"sl"."id" = $1
	`
	err := postgresRepository.Database.QueryRowx(query, sublessonId).StructScan(&response)
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
			AND
			"status" = $2
	`
	err = postgresRepository.Database.QueryRowx(levelCountQuery, sublessonId, constant.Enabled).Scan(&response.LevelCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &response, nil
}
