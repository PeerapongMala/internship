package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) MemberList(filter *constant.UserFilter, pagination *helper.Pagination) (interface{}, error) {
	parentQuery := `
		SELECT 	
        fm.user_id,
        fm.family_id,
        u.title, 
		u.first_name, 
		u.last_name, 
		u.created_at,
        CASE 
			WHEN  a.provider = 'line'  
				THEN  a.subject_id  
				ELSE NULL
		END as line_id
		FROM family.family_member fm
        INNER JOIN "user".parent p
        	ON fm.user_id = p.user_id
        INNER JOIN "user"."user" u
        	ON p.user_id = u.id
        LEFT JOIN auth.auth_oauth a
			ON p.user_id = a.user_id
        WHERE fm.family_id = $1
	`

	studentQuery := `
		SELECT 	u.id as user_id, 
				u.title, 
				u.first_name, 
				u.last_name, 
				u.created_at,
				fm.family_id,
				sc.name as school
		FROM family.family_member fm
		JOIN "user".user u
			ON u.id = fm.user_id
		JOIN "user".student st
			ON st.user_id = u.id
		JOIN school.school sc          
			ON st.school_id = sc.id
		WHERE fm.family_id = $1
	`

	var query string
	argsIndex := 2
	args := []interface{}{filter.FamilyID}

	switch filter.Role {
	case "parent":
		query = parentQuery
		if filter.LineID != "" {
			args = append(args, filter.LineID)
			query += fmt.Sprintf(` AND a.subject_id ILIKE '%%' || $%d || '%%'`, argsIndex)
			argsIndex++
		}
	case "student":
		query = studentQuery
		if filter.SchoolName != "" {
			args = append(args, filter.SchoolName)
			query += fmt.Sprintf(` AND sc.name ILIKE '%%' || $%d || '%%'`, argsIndex)
			argsIndex++
		}
	}

	if filter.UserID != "" {
		args = append(args, filter.UserID)
		query += fmt.Sprintf(` AND u.id ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}
	if filter.FirstName != "" {
		args = append(args, filter.FirstName)
		query += fmt.Sprintf(` AND u.first_name ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}
	if filter.LastName != "" {
		args = append(args, filter.LastName)
		query += fmt.Sprintf(` AND u.last_name ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}

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

	var data interface{}
	if filter.Role == "parent" {
		var parents []*constant.ParentResponse
		for rows.Next() {
			parent := constant.ParentResponse{}
			err := rows.StructScan(&parent)

			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			parents = append(parents, &parent)
		}
		data = parents
	} else if filter.Role == "student" {
		var students []*constant.StudentResponse
		for rows.Next() {
			student := constant.StudentResponse{}
			err := rows.StructScan(&student)

			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			students = append(students, &student)
		}
		data = students
	}

	return data, nil
}
