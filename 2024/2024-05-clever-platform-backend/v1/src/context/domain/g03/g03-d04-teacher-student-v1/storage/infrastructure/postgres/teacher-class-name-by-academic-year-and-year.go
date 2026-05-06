package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) TeacherClassNameByAcademicYearAndYear(
	teacherId string,
	academicYear int,
	year string,
) ([]string, error) {
	sql := `
		SELECT DISTINCT ON (c."name")
			c."name"
		FROM "class"."class" c
		INNER JOIN school.class_teacher ct ON c.id = ct.class_id
		WHERE ct.teacher_id = $1
		AND c.academic_year = $2
		AND c."year" = $3
		ORDER BY c."name" ASC
	`

	rows, err := postgresRepository.Database.Query(sql, teacherId, academicYear, year)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	classNameList := []string{}
	for rows.Next() {
		var className string
		err = rows.Scan(&className)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		classNameList = append(classNameList, className)
	}

	return classNameList, nil
}
