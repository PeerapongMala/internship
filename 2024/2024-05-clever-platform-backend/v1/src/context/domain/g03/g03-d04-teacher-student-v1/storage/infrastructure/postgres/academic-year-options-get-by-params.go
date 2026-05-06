package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) AcademicYearOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error) {
	stm := `
		SELECT
			DISTINCT c.academic_year AS id,
			c.academic_year AS label

		FROM "class"."class" AS c
		INNER JOIN school.class_student cs ON cs.class_id = c.id
		INNER JOIN school.class_teacher as ct ON ct.class_id = c.id
		WHERE cs.student_id = $1 AND
			ct.teacher_id = $2
	`

	closingQuery := "ORDER BY c.academic_year ASC"
	queryBuilder := helper.NewQueryBuilder(stm, in.Student.UserId, in.TeacherId)

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	data := []constant.OptionItem{}
	if err := postgresRepository.Database.Select(&data, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return data, nil
}
