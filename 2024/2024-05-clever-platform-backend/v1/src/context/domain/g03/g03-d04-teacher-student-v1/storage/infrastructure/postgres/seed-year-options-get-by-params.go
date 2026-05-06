package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) SeedYearOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error) {
	stm := `
	SELECT 
		DISTINCT sy.id,
		sy.short_name AS label,
		c.academic_year AS parent_id

	FROM curriculum_group.seed_year AS sy
	INNER JOIN "class"."class" c ON c."year" = sy.short_name
	INNER JOIN school.class_student cs ON cs.class_id = c.id
	INNER JOIN school.class_teacher ct ON ct.class_id = c.id
	WHERE cs.student_id = $1 AND ct.teacher_id = $2
`

	closingQuery := "ORDER BY sy.short_name ASC"
	queryBuilder := helper.NewQueryBuilder(stm, in.Student.UserId, in.TeacherId)

	if in.AcademicYear != nil {
		queryBuilder.AddFilter("AND c.academic_year =", in.AcademicYear)
	}

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	data := []constant.OptionItem{}
	if err := postgresRepository.Database.Select(&data, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return data, nil
}
