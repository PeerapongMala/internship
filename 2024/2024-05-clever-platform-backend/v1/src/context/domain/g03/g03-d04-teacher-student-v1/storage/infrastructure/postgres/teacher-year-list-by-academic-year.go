package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) TeacherYearListByAcademicYear(teacherId string, academicYear int, pagination *helper.Pagination) ([]string, error) {
	sql := `
		SELECT 
			distinct(c."year")
		FROM "class"."class" c
		INNER JOIN school.class_teacher ct ON c.id = ct.class_id
		WHERE ct.teacher_id = $1
		AND c.academic_year = $2
		`

	args := []any{teacherId, academicYear}

	totalCount, err := helper.GetTotalCountDistinct(
		postgresRepository.Database,
		"c.year",
		sql, args...)
	if err != nil {
		return []string{}, err
	}
	if totalCount == 0 {
		return []string{}, nil
	}
	pagination.TotalCount = totalCount

	sql += `ORDER BY c."year" ASC `
	if pagination.LimitResponse > 0 {
		sql += "LIMIT $3 OFFSET $4"
		args = append(args, pagination.LimitResponse, pagination.Offset)
	}

	rows, err := postgresRepository.Database.Query(sql, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var years []string
	for rows.Next() {
		var year string
		err = rows.Scan(&year)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		years = append(years, year)
	}

	return years, nil
}
