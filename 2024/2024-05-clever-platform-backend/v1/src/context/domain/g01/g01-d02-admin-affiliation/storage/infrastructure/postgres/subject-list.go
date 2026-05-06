package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectList(pagination *helper.Pagination, filter *constant.SubjectFilter) ([]constant.SubjectListDataEntity, error) {
	query := `
		SELECT
			"s"."id",
			"cg"."name" AS "curriculum_group",
			"sy"."short_name" AS "year",
			"s"."name"
		FROM "subject"."subject" s
		LEFT JOIN "curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "curriculum_group"."curriculum_group" cg
			ON "y"."curriculum_group_id" = "cg"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.SubjectGroupId != 0 {
		query += fmt.Sprintf(` AND "sg"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectGroupId)
		argsIndex++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "y"."id" = $%d`, argsIndex)
		args = append(args, filter.YearId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT (*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "s"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subjectListDataEntities := []constant.SubjectListDataEntity{}
	err := postgresRepository.Database.Select(&subjectListDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectListDataEntities, nil
}
