package postgres

import (
	"fmt"
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetClassLevels(classIds []int, lessonId int, studyGroupIds []int) (levelIds []int, err error) {
	query := `
		SELECT DISTINCT
			"l"."id"
		FROM	
		    "school"."school_sub_lesson" "ssl"
		INNER JOIN "subject"."sub_lesson" sl ON "ssl"."sub_lesson_id" = sl.id
		INNER JOIN "level"."level" "l" ON "ssl"."sub_lesson_id" = "l"."sub_lesson_id"
		INNER JOIN "class"."study_group" sg
			ON sg.class_id = ssl.class_id
		WHERE
		    "ssl"."class_id" = ANY($1)
	`
	args := []interface{}{classIds}
	argsIndex := len(args) + 1

	if len(studyGroupIds) > 0 {
		query += fmt.Sprintf(` AND "sg"."id" = ANY($%d)`, argsIndex)
		args = append(args, studyGroupIds)
		argsIndex++
	}

	if lessonId != 0 {
		query += fmt.Sprintf(` AND "sl"."lesson_id" = $%d`, argsIndex)
		args = append(args, lessonId)
		argsIndex++
	}

	err = postgresRepository.Database.Select(&levelIds, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return levelIds, err
}
