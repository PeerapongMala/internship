package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) SubLessonOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error) {
	stm := `
	SELECT
		sl.id,
		sl.name AS label,
		sl.lesson_id AS parent_id

	FROM subject.sub_lesson AS sl
	INNER JOIN subject.lesson AS ls ON ls.id = sl.lesson_id
	INNER JOIN subject.subject s ON s.id = ls.subject_id
	INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
	INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
	INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
	INNER JOIN "class"."class" c ON c."year" = sy.short_name
	INNER JOIN school.class_student cs ON cs.class_id = c.id
	INNER JOIN school.class_teacher ct ON ct.class_id = c.id
	WHERE cs.student_id = $1 AND ct.teacher_id = $2
`

	closingQuery := "ORDER BY sl.name ASC"
	queryBuilder := helper.NewQueryBuilder(stm, in.Student.UserId, in.TeacherId)

	if in.LessonId != nil {
		queryBuilder.AddFilter("AND sl.lesson_id =", in.LessonId)
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
