package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ListLearningLesson(pagination *helper.Pagination, subjectId int, userId string, studyGroupIds []int) (*[]constant.LearningLessonList, error) {
	response := []constant.LearningLessonList{}
	query := `
		WITH current_class AS (
			SELECT
				"c"."id"
			FROM
				"user"."student" s
			LEFT JOIN
       			"school"."class_student" cs
       			ON "cs"."student_id" = "s"."user_id"
			LEFT JOIN
       			"class"."class" c
       			ON "cs"."class_id" = "c"."id"
			WHERE
				"s"."user_id" = $3
				AND "c"."academic_year" = (
					SELECT
						MAX("c2"."academic_year")
					FROM
						"user"."student" s2
					LEFT JOIN "school"."class_student" cs2
						ON "cs2"."student_id" = "s2"."user_id"
					LEFT JOIN "class"."class" c2
						ON "cs2"."class_id" = "c2"."id"
					WHERE
						"s2"."user_id" = $3
				)
		)
		SELECT DISTINCT ON ("l"."id")
			"l"."id",
			"l"."subject_id",
			"l"."index",
			"l"."name",
			"l"."font_name",
			"l"."font_size",
			"l"."background_image_path",
			"l"."status",
			"l"."wizard_index",
			"l"."created_at",
			"uc"."first_name" AS "created_by",
			"l"."updated_at",
			"uu"."first_name" AS "updated_by",
			"l"."admin_login_as",
			"l"."wizard_index"
		FROM 
		    "class"."class" c
		LEFT JOIN
		    "school"."school_lesson" sl ON "c"."id" = "sl"."class_id"
		LEFT JOIN
			"subject"."lesson" l ON "sl"."lesson_id" = "l"."id"
		LEFT JOIN
			"user"."user" uu ON "l"."updated_by" = "uu"."id"
		LEFT JOIN
			"user"."user" uc ON "l"."created_by" = "uc"."id"
		LEFT JOIN 
		    "current_class" cc ON "c"."id" = "cc"."id"
		LEFT JOIN
			"school"."lesson_unlocked_for_study_group" lufsg ON "l"."id" = "lufsg"."lesson_id"
		LEFT JOIN 
		    "school"."lesson_unlocked_for_student" lufu ON "l"."id" = "lufu"."lesson_id"
		WHERE
			"l"."subject_id" = $1
			AND "l"."status" = $2
			AND "cc"."id" = "c"."id"
			AND ("sl"."is_enabled" = TRUE OR lufsg.study_group_id = ANY($4) OR (lufu.user_id = $3 AND "cc"."id" = lufu.class_id AND lufu.lesson_id = "l"."id"))
		`
	args := []interface{}{subjectId, constant.Enabled, userId, studyGroupIds}
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
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		SELECT
			"image_path",
			"level_type"
		FROM "subject"."lesson_monster_image"
		WHERE "lesson_id" = $1
		ORDER BY "level_type"
	`
	for i, lesson := range response {
		var monsters []constant.Monster
		err = postgresRepository.Database.Select(&monsters, query, lesson.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		response[i].Monsters = map[string][]string{
			"test":                 {},
			"pre-post-test":        {},
			"sub-lesson-post-test": {},
		}
		for _, monster := range monsters {
			if monster.LevelType != nil && monster.ImagePath != nil {
				response[i].Monsters[*monster.LevelType] = append(response[i].Monsters[*monster.LevelType], *monster.ImagePath)
			}
		}
	}

	return &response, nil
}
