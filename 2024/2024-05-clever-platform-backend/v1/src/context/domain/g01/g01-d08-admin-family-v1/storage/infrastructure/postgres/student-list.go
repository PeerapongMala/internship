package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]*constant.Student, error) {
	query := `
		SELECT 
			st.user_id,
			u.title,
			u.first_name,
			u.last_name
		FROM family.family_member fm
		RIGHT JOIN "user".student st
			ON fm.user_id = st.user_id
		INNER JOIN "user".user u
			ON u.id = st.user_id
		INNER JOIN school.class_student cs
			ON st.user_id = cs.student_id
		INNER JOIN class.class cc
			ON cs.class_id = cc.id
		INNER JOIN school.school s
			ON cc.school_id = s.id
		WHERE 
			fm.user_id ISNULL
	`
	args := []interface{}{}
	argsIndex := 1
	if filter.Search != "" {
		args = append(args, filter.Search)
		searchIdx := []string{"st.user_id", "u.title", "u.first_name", "u.last_name"}
		searchConditions := make([]string, len(searchIdx))

		for idx, col := range searchIdx {
			searchConditions[idx] = fmt.Sprintf(`%s ILIKE '%%' || $%d || '%%'`, col, argsIndex)
		}

		query += fmt.Sprintf(` AND (%s) `, strings.Join(searchConditions, " OR "))
		argsIndex++
	}
	if filter.SchoolID != 0 {
		args = append(args, filter.SchoolID)
		query += fmt.Sprintf(` AND cc.school_id = $%d `, argsIndex)
		argsIndex++
	}
	if filter.AcademicYear != 0 {
		args = append(args, filter.AcademicYear)
		query += fmt.Sprintf(` AND cc.academic_year = $%d `, argsIndex)
		argsIndex++
	}
	if filter.Year != "" {
		args = append(args, filter.Year)
		query += fmt.Sprintf(` AND cc.year = $%d `, argsIndex)
		argsIndex++
	}
	if filter.ClassName != "" {
		args = append(args, filter.ClassName)
		query += fmt.Sprintf(` AND cc.name = $%d `, argsIndex)
		argsIndex++
	}

	query += fmt.Sprintf(`GROUP BY st.user_id, u.title, u.first_name, u.last_name`)

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(
		countQuery,
		args...,
	).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	args = append(args, pagination.Offset, pagination.Limit)
	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var students []*constant.Student
	for rows.Next() {
		student := constant.Student{}
		err := rows.StructScan(&student)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		students = append(students, &student)
	}

	return students, nil
}
