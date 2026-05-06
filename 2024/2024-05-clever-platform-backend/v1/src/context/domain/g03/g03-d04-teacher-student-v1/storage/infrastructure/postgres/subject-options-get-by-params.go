package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) SubjectOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error) {
	stm := `
	WITH "school_id" AS (
			SELECT
				"st"."school_id"
			FROM		
			    "school"."school_teacher" st
			WHERE "st"."user_id" = $2
			LIMIT 1
	)
	SELECT
		DISTINCT s.id,
		CONCAT(cg.name, ' - ', s.name) AS label,
		y.seed_year_id AS parent_id

	FROM subject.subject AS s
	INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
	INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
	INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
	INNER JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id"
	INNER JOIN "curriculum_group"."curriculum_group" cg ON "p"."curriculum_group_id" = "cg"."id"
	INNER JOIN "class"."class" c ON c."year" = sy.short_name
	INNER JOIN school.class_student cs ON cs.class_id = c.id
	INNER JOIN school.class_teacher ct ON ct.class_id = c.id
    INNER JOIN "school"."school_subject" ss ON ss.school_id = (SELECT "school_id" FROM "school_id" ) AND "ss"."subject_id" = s.id
	WHERE cs.student_id = $1 AND ct.teacher_id = $2
	AND "sy"."id" = $3 
`

	closingQuery := "ORDER BY label ASC"
	queryBuilder := helper.NewQueryBuilder(stm, in.Student.UserId, in.TeacherId, in.SeedYearId)

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
