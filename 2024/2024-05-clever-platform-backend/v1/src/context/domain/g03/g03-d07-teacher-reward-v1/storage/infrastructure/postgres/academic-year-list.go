package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) AcademicYearList(teacherId string, pagination *helper.Pagination) ([]constant.AcademicYear, error) {
	query := `
			SELECT DISTINCT ON ("c"."academic_year")
			    "c"."academic_year"
			FROM "subject"."subject_teacher" st
			INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
			INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
			INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
			INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
			INNER JOIN "school"."class_teacher" ct ON "ct"."teacher_id" = $1
			INNER JOIN "class"."class" c ON "ct"."class_id" = "c"."id" AND "sy"."short_name" = "c"."year"
			WHERE	
				"st"."teacher_id" = $1
	`
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRow(countQuery, teacherId).Scan(&pagination.TotalCount)
	if err != nil {
		return nil, err
	}
	query += fmt.Sprintf(` ORDER BY academic_year DESC LIMIT $2 OFFSET $3`)
	response := []constant.AcademicYear{}
	err = postgresRepository.Database.Select(&response, query, teacherId, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, err

	}
	return response, nil
}
