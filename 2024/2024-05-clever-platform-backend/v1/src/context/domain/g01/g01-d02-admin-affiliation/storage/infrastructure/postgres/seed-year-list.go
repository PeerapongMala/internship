package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SeedYearList(filter *constant.SeedYearFilter, pagination *helper.Pagination) ([]constant.SeedYearEntity, error) {
	query := `
		SELECT
			"sy"."id",
			"sy"."name",
			"sy"."short_name",
			"sy"."status",
			"sy"."created_at",
			"sy"."created_by",
			"sy"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM
			"curriculum_group"."seed_year" sy
		LEFT JOIN
			"user"."user" u
			ON "sy"."updated_by" = "u"."id"
		WHERE
			TRUE
`
	args := []interface{}{}
	argsIndex := 1

	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "sy"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND "sy"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex++
	}
	if filter.ShortName != "" {
		query += fmt.Sprintf(` AND "sy"."short_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.ShortName+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "sy"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if !filter.StartDate.IsZero() {
		query += fmt.Sprintf(` AND "sy"."created_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if !filter.EndDate.IsZero() {
		query += fmt.Sprintf(` AND "sy"."created_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "sy"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	seedYearEntities := []constant.SeedYearEntity{}
	err := postgresRepository.Database.Select(&seedYearEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return seedYearEntities, nil
}
