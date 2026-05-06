package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelCaseListUnlockedStudyGroup(classId, levelId int, pagination *helper.Pagination) ([]constant.LevelUnlockedForStudyGroupEntity, error) {
	query := `
		SELECT
		    "sg"."id",
			"sg"."name" AS "study_group_name",
			"c"."year",
			"c"."name" AS "class",
			COUNT("sgs"."student_id") AS "student_count"
		FROM
			"level"."level_unlocked_for_study_group" lu
		LEFT JOIN
			"level"."level" l
			ON "lu"."level_id" = "l"."id"
		LEFT JOIN
			"subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN
			"subject"."lesson" ls
			ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN
			"subject"."subject" s
			ON "ls"."subject_id" = "s"."id"
		LEFT JOIN
			"class"."study_group" sg
			ON "lu"."study_group_id" = "sg"."id"
			AND "s"."id" = "sg"."subject_id"
		LEFT JOIN
			"class"."class" c
			ON "sg"."class_id" = "c"."id"
		LEFT JOIN
			"class"."study_group_student" sgs
			ON "sg"."id" = "sgs"."study_group_id"
		WHERE
			"lu"."level_id" = $1
			AND
			"sg"."class_id" = $2
	`
	args := []interface{}{levelId, classId}
	argsIndex := 3

	query += fmt.Sprintf(`
		GROUP BY
			"sg"."id",
			"sg"."name",
			"c"."year",
			"c"."name"
	`)
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "sg"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	levelUnlockedForStudyGroupEntities := []constant.LevelUnlockedForStudyGroupEntity{}
	err := postgresRepository.Database.Select(&levelUnlockedForStudyGroupEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return levelUnlockedForStudyGroupEntities, nil
}
