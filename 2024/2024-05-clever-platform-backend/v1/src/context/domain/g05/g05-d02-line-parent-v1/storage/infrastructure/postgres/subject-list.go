package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectList(in *constant.OverViewStatusFilter, pagination *helper.Pagination) ([]*constant.Subject, error) {
	query := `
		SELECT DISTINCT ON (s.id)
			s.id AS subject_id,
			s.name AS subject_name
		FROM "user".student us
		INNER JOIN school.class_student cs
			ON us.user_id = cs.student_id
		INNER JOIN class.class cc
			ON cc.id = cs.class_id	
		INNER JOIN school.school_subject ss
			ON us.school_id = ss.school_id   
		INNER JOIN subject.subject s
			ON s.id = ss.subject_id
		INNER JOIN curriculum_group.subject_group sg
			ON s.subject_group_id = sg.id
		INNER JOIN curriculum_group.year y
			ON sg.year_id = y.id
		INNER JOIN curriculum_group.seed_year sy
			ON y.seed_year_id = sy.id 
			AND sy.short_name = cc.year
		WHERE 
			us.user_id = $1
			AND cs.class_id = $2
	`

	args := []interface{}{in.StudentID, in.ClassID}
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
	query += fmt.Sprintf(` OFFSET $3 LIMIT $4`)

	var subjects []*constant.Subject
	err = postgresRepository.Database.Select(&subjects, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjects, nil
}
