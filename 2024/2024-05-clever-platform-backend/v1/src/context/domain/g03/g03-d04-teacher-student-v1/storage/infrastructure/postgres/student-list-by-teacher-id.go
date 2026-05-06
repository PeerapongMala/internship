package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentListByTeacherId(
	teacherId string,
	pagination *helper.Pagination,
	filter constant.StudentListByTeacherIdFilter,
) ([]constant.StudentEntity, error) {
	query := `
			SELECT DISTINCT ON ("u"."id")
			    "u"."id" AS "user_id", 
				"stu"."student_id",
				"u"."title",
				"u"."first_name",
				"u"."last_name",
				"u"."email",
				"u"."last_login"
			FROM "subject"."subject_teacher" st
			INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
			INNER JOIN "curriculum_group"."subject_group" sjg ON "s"."subject_group_id" = "sjg"."id"
			INNER JOIN "curriculum_group"."year" y ON "sjg"."year_id" = "y"."id"
			INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
			INNER JOIN "school"."class_teacher" ct ON "ct"."teacher_id" = $1
			INNER JOIN "class"."class" c ON "sy"."short_name" = "c"."year" AND "ct"."class_id" = "c"."id"
			INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id" 
			INNER JOIN "school"."class_student" cst ON "c"."id" = "cst"."class_id"
			INNER JOIN "user"."user" u ON "cst"."student_id" = "u"."id"
			INNER JOIN "user"."student" stu ON "u"."id" = "stu"."user_id"
			WHERE	
				"st"."teacher_id" = $1 AND "sct"."user_id" = $1 AND "c"."status" = 'enabled'
	`
	args := []interface{}{teacherId}
	argsIndex := len(args) + 1

	if filter.ClassId != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		argsIndex++
		args = append(args, filter.ClassId)
	}
	if filter.AcademicYear != "" {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		argsIndex++
		args = append(args, filter.AcademicYear)
	}
	if filter.Search != "" {
		query += fmt.Sprintf(`
			AND (
				"u"."first_name" ILIKE $%d
				OR "u"."last_name" ILIKE $%d
			)
		`, argsIndex, argsIndex)
		args = append(args, filter.Search)
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

	studentInfoList := []constant.StudentEntity{}

	if err := postgresRepository.Database.Select(&studentInfoList, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studentInfoList, nil
}
