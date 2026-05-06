package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) GradeEvaluationFormList(
	filter constant.GradeEvaluationFormListFilter,
	pagination *helper.Pagination,
) ([]constant.GradeFormListEntity, error) {
	// Base query
	query := `
		SELECT 
			gef.id,
			gef.template_id,
			gt.template_name AS template_name,
			gef.academic_year,
			gef.year,
			gef.school_room,
			gef.school_term,
			gef.is_lock,
			gef.status,
			gef.is_archived,
    		(SELECT COUNT(*) FROM grade.evaluation_sheet es WHERE es.form_id = gef.id AND es.status IN ('sent', 'approve')) as ongoing_sheet_count,
    		(SELECT COUNT(*) FROM grade.evaluation_sheet es WHERE es.form_id = gef.id) as total_signed_sheet_count
		FROM grade.evaluation_form gef
		LEFT JOIN grade.template gt ON gef.template_id = gt.id
		WHERE gef.school_id = $1
	`

	args := []interface{}{filter.SchoolId}
	idx := 2

	// Apply dynamic filters
	if filter.TemplateID != nil {
		query += fmt.Sprintf(" AND gef.template_id = $%d", idx)
		args = append(args, *filter.TemplateID)
		idx++
	}
	if filter.AcademicYear != "" {
		query += fmt.Sprintf(" AND gef.academic_year = $%d", idx)
		args = append(args, filter.AcademicYear)
		idx++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(" AND gef.year = $%d", idx)
		args = append(args, filter.Year)
		idx++
	}
	if filter.SchoolRoom != "" {
		query += fmt.Sprintf(" AND gef.school_room = $%d", idx)
		args = append(args, filter.SchoolRoom)
		idx++
	}
	if filter.SchoolTerm != "" {
		query += fmt.Sprintf(" AND gef.school_term = $%d", idx)
		args = append(args, filter.SchoolTerm)
		idx++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(" AND gef.status = $%d", idx)
		args = append(args, filter.Status)
		idx++
	}
	if filter.TemplateName != "" {
		query += fmt.Sprintf(" AND gt.template_name = $%d", idx)
		args = append(args, filter.TemplateName)
		idx++
	}
	if filter.IsArchived != nil {
		query += fmt.Sprintf(" AND gef.is_archived = $%d", idx)
		args = append(args, *filter.IsArchived)
		idx++
	}
	if filter.Search != "" {
		searchTerm := fmt.Sprintf("%%%s%%", filter.Search)
		query += fmt.Sprintf(`
		AND (
			CAST(gef.template_id AS TEXT) ILIKE $%d OR
			gt.template_name ILIKE $%d OR
			gef.academic_year ILIKE $%d OR
			gef.year ILIKE $%d OR
			gef.school_room ILIKE $%d OR
			gef.school_term ILIKE $%d
		)
	`, idx, idx, idx, idx, idx, idx)
		args = append(args, searchTerm)
		idx++
	}

	// Count total before pagination
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) AS count_table", query)
	err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	// Apply ordering and pagination
	query += fmt.Sprintf(` ORDER BY "%s" %s`, pagination.SortBBy, pagination.SortOrder)
	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", idx, idx+1)
	args = append(args, pagination.Limit, pagination.Offset)

	// Query data
	entities := []constant.GradeFormListEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
