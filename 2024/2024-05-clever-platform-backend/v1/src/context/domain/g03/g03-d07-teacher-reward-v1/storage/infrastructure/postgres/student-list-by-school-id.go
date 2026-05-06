package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) StudentListBySchoolId(teacherId string, filter constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentResponse, error) {
	query := `
		SELECT DISTINCT ON ("u"."id")
			    "u"."id" AS "user_id", 
				"stu"."student_id",
				"u"."title",
				"u"."first_name",
				"u"."last_name"
			FROM "subject"."subject_teacher" st
			INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
			INNER JOIN "curriculum_group"."subject_group" sjg ON "s"."subject_group_id" = "sjg"."id"
			INNER JOIN "curriculum_group"."year" y ON "sjg"."year_id" = "y"."id"
			INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
			INNER JOIN "school"."class_teacher"  ct ON "ct"."teacher_id" = $1
			INNER JOIN "class"."class" c ON "sy"."short_name" = "c"."year"
			INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id" 
			INNER JOIN "school"."class_student" cst ON "c"."id" = "cst"."class_id"
			INNER JOIN "user"."user" u ON "cst"."student_id" = "u"."id"
			INNER JOIN "user"."student" stu ON "u"."id" = "stu"."user_id"
			LEFT JOIN "class"."study_group" sg ON "c"."id" = "sg"."class_id"
			LEFT JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
			WHERE	
				"st"."teacher_id" = $1 AND "sct"."user_id" = $1 AND "c"."status" = 'enabled' AND "sg"."status" = 'enabled'
	`
	args := []interface{}{filter.TeacherId}
	argI := 2

	if filter.StudentId != "" {
		query += fmt.Sprintf(` AND "stu"."student_id" = $%d`, argI)
		args = append(args, filter.StudentId)
		argI++
	}
	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argI)
		args = append(args, filter.AcademicYear)
		argI++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(` AND "c"."year" = $%d`, argI)
		args = append(args, filter.Year)
		argI++
	}
	if filter.Class != "" {
		query += fmt.Sprintf(` AND "c"."name" = $%d`, argI)
		args = append(args, filter.Class)
		argI++
	}
	if filter.StudyGroupId != 0 {
		query += fmt.Sprintf(` AND "sgs"."study_group_id" = $%d`, argI)
		args = append(args, filter.StudyGroupId)
		argI++
	}

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRow(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		return nil, err
	}
	query += fmt.Sprintf(` ORDER BY "u"."id" LIMIT $%d OFFSET $%d`, argI, argI+1)
	args = append(args, pagination.Limit, pagination.Offset)
	response := []constant.StudentResponse{}
	err = postgresRepository.Database.Select(&response, query, args...)
	if err != nil {
		return nil, err
	}
	return response, nil
}
