package postgres

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassList(schoolId int, filter constant.ClassroomListFilter, pagination *helper.Pagination) ([]constant.ClassEntity, error) {
	query := `
		SELECT
			"id",
			"school_id",
			"academic_year",
			"year",
			"name",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by"
		FROM "class"."class"
		WHERE "school_id" = $1
	`
	args := []interface{}{schoolId}
	idx := 2

	if filter.Status != "" {
		query += fmt.Sprintf(` AND "status" = $%d`, idx)
		args = append(args, filter.Status)
		idx++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(` AND "year" = $%d`, idx)
		args = append(args, filter.Year)
		idx++
	}
	if filter.AcademicYear != nil {
		query += fmt.Sprintf(` AND "academic_year" = $%d`, idx)
		args = append(args, *filter.AcademicYear)
		idx++
	}
	if !filter.StartUpdatedAt.IsZero() {
		query += fmt.Sprintf(` AND "created_at" >= $%d`, idx)
		args = append(args, filter.StartUpdatedAt.Format(time.RFC3339))
		idx++
	}
	if !filter.EndUpdatedAt.IsZero() {
		query += fmt.Sprintf(` AND "created_at" <= $%d`, idx)
		args = append(args, filter.EndUpdatedAt.Format(time.RFC3339))
		idx++
	}
	if filter.Search != "" {
		qSearch := "%" + filter.Search + "%"
		var conditions []string
		var argsToAdd []interface{}

		if id, err := strconv.Atoi(filter.Search); err == nil {
			conditions = append(conditions, fmt.Sprintf(`class."id" = $%d`, idx))
			argsToAdd = append(argsToAdd, id)
			idx++
		}

		conditions = append(conditions, fmt.Sprintf(`year ILIKE $%d`, idx))
		argsToAdd = append(argsToAdd, qSearch)
		idx++

		conditions = append(conditions, fmt.Sprintf(`name ILIKE $%d`, idx))
		argsToAdd = append(argsToAdd, qSearch)
		idx++

		if len(conditions) > 0 {
			query += " AND (" + strings.Join(conditions, " OR ") + ")"
			args = append(args, argsToAdd...)
		}
	}

	if pagination != nil {
		countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) as count_table", query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "%s" %s`, pagination.SortBBy, pagination.SortOrder)
		query += fmt.Sprintf(` LIMIT $%d OFFSET $%d`, idx, idx+1)
		args = append(args, pagination.Limit, pagination.Offset)
	}

	classEntities := []constant.ClassEntity{}
	err := postgresRepository.Database.Select(&classEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classEntities, nil
}
