package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentListTotalCountByTeacherId(
	teacherId string,
	pagination *helper.Pagination,
	filter constant.StudentListByTeacherIdFilter,
) error {
	if pagination == nil {
		return nil
	}

	baseQuery := `
		WITH const_cte AS (
				SELECT $1 AS id	
		),
		class_year_short_name_list AS (
			SELECT 
				sy.short_name AS class_year_short_name
			FROM subject.subject_teacher st
			LEFT JOIN subject.subject s ON s.id = st.subject_id
			LEFT JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
			LEFT JOIN curriculum_group."year" y ON y.id = sg.year_id
			LEFT JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
			WHERE st.teacher_id = (SELECT id FROM const_cte)
		)
		SELECT 
			COUNT(distinct(s.user_id)) AS total_count
		FROM school.class_student cs
		LEFT JOIN "user".student s ON cs.student_id = s.user_id
		LEFT JOIN school.class_teacher ct ON ct.class_id = cs.class_id
		LEFT JOIN "class"."class" c ON c.id = cs.class_id
		LEFT JOIN "user".user u ON u.id = s.user_id
		WHERE 
			( 
				ct.teacher_id = (SELECT id FROM const_cte) OR 
				c."year" IN (SELECT class_year_short_name FROM class_year_short_name_list)
			)
			AND c.school_id = $2
	`

	queryBuilder := helper.NewQueryBuilder(baseQuery, teacherId, filter.SchoolId)

	if filter.AcademicYear != "" {
		queryBuilder.AddFilter("AND c.academic_year =", filter.AcademicYear)
	}
	if filter.Year != "" {
		queryBuilder.AddFilter("AND c.year =", filter.Year)
	}
	if filter.Name != "" {
		queryBuilder.AddFilter("AND c.name =", filter.Name)
	}
	if filter.Search != "" {
		queryBuilder.AddFilter("AND ( CONCAT(u.first_name , ' ', u.last_name) ILIKE", "%"+filter.Search+"%")
		queryBuilder.AddFilter("OR s.student_id ILIKE", "%"+filter.Search+"%")
		queryBuilder.AddFilter("OR u.email ILIKE", "%"+filter.Search+"%")
		queryBuilder.AddFilter(")", nil)
	}

	query, args := queryBuilder.Build()

	err := postgresRepository.Database.QueryRowx(query, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
