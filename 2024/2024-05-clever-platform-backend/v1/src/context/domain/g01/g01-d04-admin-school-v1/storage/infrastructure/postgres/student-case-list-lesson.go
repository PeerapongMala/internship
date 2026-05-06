package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListLesson(userId string, filter constant.LessonFilter) ([]constant.LessonEntity, error) {
	query := `
		SELECT DISTINCT	
			"ls"."id",
			"ls"."name"
		FROM
			"subject"."lesson" ls
		LEFT JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
		LEFT JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."curriculum_group" c ON "y"."curriculum_group_id" = "c"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	// if filter.AcademicYear != 0 {
	// 	query += fmt.Sprintf(` AND "cs"."academic_year" = $%d`, argsIndex)
	// 	args = append(args, filter.AcademicYear)
	// 	argsIndex++
	// }
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}
	query += fmt.Sprintf(` ORDER BY "ls"."id"`)
	lessonEntities := []constant.LessonEntity{}
	err := postgresRepository.Database.Select(&lessonEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return lessonEntities, nil
}
