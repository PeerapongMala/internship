package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LessonCaseListUnlockedStudyGroup(classId, lessonId int, pagination *helper.Pagination) ([]constant.LevelUnlockedForStudyGroupEntity, error) {
	query := `
		SELECT
			"sg"."id",
			"sg"."name" AS "study_group_name",
			"c"."year",
			"c"."name" AS "class",	
			COALESCE(COUNT("sgs"."student_id"), 0) AS "student_count"
		FROM "school"."lesson_unlocked_for_study_group" lu
		INNER JOIN "class"."study_group" sg	ON "lu"."study_group_id" = "sg"."id"
		INNER JOIN "class"."class" c ON "sg"."class_id" = "c"."id"
		LEFT JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
		WHERE
		    "c"."id" = $1
			AND "lu"."lesson_id" = $2
	`
	args := []interface{}{classId, lessonId}
	argsIndex := len(args) + 1

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

	studyGroups := []constant.LevelUnlockedForStudyGroupEntity{}
	err := postgresRepository.Database.Select(&studyGroups, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studyGroups, nil
}
