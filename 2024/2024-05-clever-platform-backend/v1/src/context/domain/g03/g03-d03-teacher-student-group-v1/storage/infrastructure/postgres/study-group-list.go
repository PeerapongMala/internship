package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (p *postgresRepository) StudyGroupList(filter constant.StudyGroupListFilter) ([]constant.StudyGroupList, error) {
	args := []any{}
	query := `
		SELECT 
			sg.id, 
			sg.subject_id, 
			sg.class_id, 
			sg.name,
			c.year,
			c.academic_year,
			c.name AS class_name,
			sg.created_at, 
			u_created.first_name AS created_by,
			sg.updated_at, 
			u_updated.first_name AS updated_by
			FROM class.study_group sg
		INNER JOIN class.class c
			ON c.id = sg.class_id
		INNER JOIN "user".user u_created
            ON u_created.id = sg.created_by
		LEFT JOIN "user".user u_updated 
            ON u_updated.id = sg.updated_by
		WHERE 
			TRUE `
	argIndex := 1

	if len(filter.ClassIDs) > 0 {
		placeholders := make([]string, len(filter.ClassIDs))
		for i := range filter.ClassIDs {
			placeholders[i] = fmt.Sprintf("$%d", argIndex+i)
			args = append(args, filter.ClassIDs[i])
		}
		query += fmt.Sprintf("AND sg.class_id IN (%s) ", strings.Join(placeholders, ", "))
		argIndex += len(filter.ClassIDs)
	}

	if filter.Year != "" {
		query += fmt.Sprintf("AND c.year = $%d ", argIndex)
		args = append(args, filter.Year)
		argIndex++
	}

	if filter.AcademicYear != 0 {
		query += fmt.Sprintf("AND c.academic_year = $%d ", argIndex)
		args = append(args, filter.AcademicYear)
		argIndex++
	}

	totalCount, err := helper.GetTotalCount(p.Database, query, args...)
	if err != nil {
		return nil, err
	}
	if totalCount == 0 {
		return []constant.StudyGroupList{}, nil
	}
	filter.Pagination.TotalCount = totalCount

	query += fmt.Sprintf("LIMIT $%d ", argIndex)
	args = append(args, filter.Pagination.LimitResponse)
	argIndex++

	query += fmt.Sprintf("OFFSET $%d ", argIndex)
	args = append(args, filter.Pagination.Offset)
	argIndex++

	studyGroups := make([]constant.StudyGroupList, 0)
	if err := p.Database.Select(&studyGroups, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studyGroups, nil
}
