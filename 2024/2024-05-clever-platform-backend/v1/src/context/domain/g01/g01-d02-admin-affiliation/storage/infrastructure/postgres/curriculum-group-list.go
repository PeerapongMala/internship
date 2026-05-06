package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CurriculumGroupList(pagination *helper.Pagination, filter *constant.CurriculumGroupFilter) ([]constant.CurriculumGroupEntity, error) {
	query := `
		SELECT
			"cg"."id",
			"cg"."name",
			"cg"."short_name",	
			"cg"."status",
			"cg"."created_at",
			"cg"."created_by",
			"cg"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM "curriculum_group"."curriculum_group" cg
		LEFT JOIN
			"user"."user" u
			ON "cg"."updated_by" = "u"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if !filter.StartDate.IsZero() {
		query += fmt.Sprintf(` AND "cg"."created_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if !filter.EndDate.IsZero() {
		query += fmt.Sprintf(` AND "cg"."created_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND "cg"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex++
	}
	if filter.ShortName != "" {
		query += fmt.Sprintf(` AND "cg"."short_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.ShortName+"%")
		argsIndex++
	}
	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "cg"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	query += ` ORDER BY "cg"."created_at" ASC`

	if pagination != nil {
		countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s)", query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` LIMIT $%d OFFSET $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Limit, pagination.Offset)
	}

	curriculumGroupEntities := []constant.CurriculumGroupEntity{}
	err := postgresRepository.Database.Select(&curriculumGroupEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	log.Println(curriculumGroupEntities)

	return curriculumGroupEntities, nil
}
