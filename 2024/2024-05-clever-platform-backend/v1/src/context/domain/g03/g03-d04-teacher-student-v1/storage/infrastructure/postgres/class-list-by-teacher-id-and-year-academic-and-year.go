package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (p *postgresTeacherStudentRepository) ClassListByTeacherIDAndYearAndAcademicYear(teacherID string, request constant.ClassListByTeacherIdAndAcademicYearAndYearRequest, pagination *helper.Pagination) ([]constant.ClassListByTeacherIdAndAcademicYearAndYearData, error) {
	query := `
		WITH teacher_schools AS (
			SELECT
				school_id
			FROM school.school_teacher
			WHERE user_id = $1
			LIMIT 1
		)	
		SELECT
			c.id, 
			c.name,
			c.year
		FROM subject.subject_teacher st
		INNER JOIN subject.subject s ON st.subject_id = s.id
		INNER JOIN curriculum_group.subject_group sg ON s.subject_group_id = sg.id
		INNER JOIN curriculum_group.year y ON sg.year_id = y.id
		INNER JOIN curriculum_group.seed_year sy ON y.seed_year_id = sy.id
		INNER JOIN "school"."class_teacher" ct ON "ct"."teacher_id" = $1
		INNER JOIN class.class c ON sy.short_name = c.year AND "ct"."class_id" = "c"."id"
		INNER JOIN teacher_schools ts ON c.school_id = ts.school_id
		WHERE 
			st.teacher_id = $1
			AND st.subject_id = $2
			AND c.academic_year = $3
	`

	args := []any{teacherID, request.SubjectID, request.AcademicYear}
	argsIndex := len(args) + 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := p.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "c"."name" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	classList := []constant.ClassListByTeacherIdAndAcademicYearAndYearData{}
	err := p.Database.Select(&classList, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classList, nil
}
