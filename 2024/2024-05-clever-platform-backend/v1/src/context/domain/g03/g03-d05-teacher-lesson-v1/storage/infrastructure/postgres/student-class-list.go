package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentClassList(filter *constant.ClassFilter, pagination *helper.Pagination) ([]constant.ClassEntity, error) {
	query := `
		SELECT DISTINCT ON ("c"."id")
			"c"."id",
    		"c"."name",
		    "c"."academic_year",
    		"c"."year",
    		"c"."updated_at",
    		"c"."updated_by"
		FROM
		    "school"."class_student" cs
		LEFT JOIN
			"class"."class" c ON "cs"."class_id" = "c"."id"
		WHERE
		    "cs"."student_id" = $1
	`
	args := []interface{}{filter.StudentId}
	argsIndex := len(args) + 1

	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex++
	}
	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND "c"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(` AND "c"."year" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Year+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "c"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	classEntities := []constant.ClassEntity{}
	err := postgresRepository.Database.Select(&classEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classEntities, nil
}
