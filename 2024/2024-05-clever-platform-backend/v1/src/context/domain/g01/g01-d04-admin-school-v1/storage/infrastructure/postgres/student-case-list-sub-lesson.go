package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListSubLesson(userId string, filter *constant.SubLessonFilter) ([]constant.SubLessonEntity, error) {
	query := `
		SELECT DISTINCT	
			"sl"."id",
			"sl"."name"
		FROM
			"subject"."sub_lesson" sl
		LEFT JOIN
			"subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN
			"subject"."subject" s ON "ls"."subject_id" = "s"."id"
		LEFT JOIN 
			"curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN 
			"curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		LEFT JOIN 
			"curriculum_group"."curriculum_group" c ON "y"."curriculum_group_id" = "c"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.LessonId != 0 {
		query += fmt.Sprintf(` AND "ls"."id" = $%d`, argsIndex)
		args = append(args, filter.LessonId)
		argsIndex++
	}
	query += fmt.Sprintf(` ORDER BY "sl"."id" `)
	subLessonEntities := []constant.SubLessonEntity{}
	err := postgresRepository.Database.Select(&subLessonEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subLessonEntities, nil
}
