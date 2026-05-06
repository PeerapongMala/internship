package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) TeacherRewardList(teacherId string, filter constant.TeacherRewardListFilter, pagination *helper.Pagination) ([]constant.TeacherRewardList, error) {
	query := `
		WITH "target_students" AS (
			SELECT
				"cs"."student_id"
			FROM "subject"."subject_teacher" st
			INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
			INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
			INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
			INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
			INNER JOIN "school"."class_teacher"  ct ON "ct"."teacher_id" = $1
			INNER JOIN "class"."class" c ON "sy"."short_name" = "c"."year"
			INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id" 
			INNER JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
			WHERE	
				"st"."teacher_id" = $1 AND "sct"."user_id" = $1
		)	
		SELECT DISTINCT ON ("trt"."id")
		    "trt"."id",
		    "u"."title" AS "student_title",
			"u"."first_name" AS "student_first_name",
			"u"."last_name" AS "student_last_name",
			"c"."academic_year",
			"c"."year" AS "year",
			"i"."name" AS "item_name",
			"c"."name" AS "class_name",
			"trt"."amount" AS "item_amount",
			"trt"."status", 
			"stu"."student_id"
		FROM "target_students" ts
		INNER JOIN "teacher_item"."teacher_reward_transaction" trt ON "ts"."student_id" = "trt"."student_id"
		INNER JOIN "user"."user" u ON "trt"."student_id" = "u"."id"
		INNER JOIN "user"."student" stu ON "u"."id" = "stu"."user_id"
		INNER JOIN "item"."item" i ON "trt"."item_id" = "i"."id"
		INNER JOIN "class"."class" c ON "trt"."class_id" = "c"."id"
		WHERE "trt"."teacher_id" = $1
	 `
	args := []interface{}{teacherId}
	argI := 2

	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "trt"."subject_id" = $%d`, argI)
		args = append(args, filter.SubjectId)
		argI++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "trt"."status" = $%d`, argI)
		args = append(args, filter.Status)
		argI++
	}
	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "trt"."id" = $%d`, argI)
		args = append(args, filter.Id)
		argI++
	}
	if filter.ItemName != "" {
		query += fmt.Sprintf(` AND "i"."name" LIKE $%d`, argI)
		args = append(args, "%"+filter.ItemName+"%")
		argI++
	}
	if filter.Amount != 0 {
		query += fmt.Sprintf(` AND "trt"."amount" = $%d`, argI)
		args = append(args, filter.Amount)
		argI++
	}
	if filter.StudentId != "" {
		query += fmt.Sprintf(` AND "stu"."student_id" LIKE $%d`, argI)
		args = append(args, "%"+filter.StudentId+"%")
		argI++
	}
	if filter.FirstName != "" {
		query += fmt.Sprintf(` AND "u2"."first_name" LIKE $%d`, argI)
		args = append(args, "%"+filter.FirstName+"%")
		argI++
	}
	if filter.LastName != "" {
		query += fmt.Sprintf(` AND "u2"."last_name" LIKE $%d`, argI)
		args = append(args, "%"+filter.LastName+"%")
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
	if filter.ClassId != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argI)
		args = append(args, filter.ClassId)
		argI++
	}

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRow(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		return nil, err
	}

	query += fmt.Sprintf(` ORDER BY "trt"."id" LIMIT $%d OFFSET $%d`, argI, argI+1)
	args = append(args, pagination.Limit, pagination.Offset)
	response := []constant.TeacherRewardList{}
	err = postgresRepository.Database.Select(&response, query, args...)
	if err != nil {
		return nil, err
	}
	return response, nil
}
