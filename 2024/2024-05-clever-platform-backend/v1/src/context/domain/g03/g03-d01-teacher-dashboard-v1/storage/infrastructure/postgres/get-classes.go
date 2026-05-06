package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetClasses(
	classIds []int,
	filter *constant.ClassFilter,
	pagination *helper.Pagination,
) (entities []constant.ClassEntity, err error) {
	query := `
		SELECT 
			*
		FROM
			"class"."class"
		WHERE
			"id" = ANY($1)
	`
	args := []interface{}{classIds}
	argsIndex := 2

	if filter != nil && len(filter.AcademicYears) > 0 {
		query += fmt.Sprintf(` AND "academic_year" = ANY($%d)`, argsIndex)
		args = append(args, filter.AcademicYears)
		argsIndex++
	}

	if filter != nil && len(filter.Years) > 0 {
		query += fmt.Sprintf(` AND "year" = ANY($%d)`, argsIndex)
		args = append(args, filter.Years)
		argsIndex++
	}

	//sort := ` ORDER BY academic_year DESC`
	//query += sort

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "name" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.ClassEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
