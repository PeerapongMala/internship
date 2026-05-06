package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectTeacherList(schoolId int, subjectId int, filter *constant.SubjectTeacherFilter, pagination *helper.Pagination) ([]constant.TeacherEntity, error) {
	query := `
		SELECT
			"u"."id",
			"st"."academic_year",
			"u"."title",
			"u"."first_name",
			"u"."last_name",
			"u"."email",
			"u"."last_login"
		FROM
		    "subject"."subject_teacher" st
		LEFT JOIN
			"user"."user" u
			ON "st"."teacher_id" = "u"."id"
		LEFT JOIN
		    "school"."school_teacher" sct
			ON "st"."teacher_id" = "sct"."user_id"
		WHERE
		    "st"."subject_id" = $2
			AND "sct"."school_id" = $1
	`
	args := []interface{}{schoolId, subjectId}
	argsIndex := len(args) + 1

	if filter.Id != "" {
		query += fmt.Sprintf(` AND "u"."id" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Id+"%")
		argsIndex++
	}
	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "st"."academic_year" = $%d`, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex++
	}
	if filter.Title != "" {
		query += fmt.Sprintf(` AND "u"."title" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Title+"%")
		argsIndex++
	}
	if filter.FirstName != "" {
		query += fmt.Sprintf(` AND "u"."first_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.FirstName+"%")
		argsIndex++
	}
	if filter.LastName != "" {
		query += fmt.Sprintf(` AND "u"."last_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LastName+"%")
		argsIndex++
	}
	if filter.Email != "" {
		query += fmt.Sprintf(` AND "u"."email" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Email+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "u"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	teacherEntities := []constant.TeacherEntity{}
	err := postgresRepository.Database.Select(&teacherEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teacherEntities, nil
}
