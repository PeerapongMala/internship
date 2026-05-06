package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) YearList(platformId int, filter *constant.YearFilter, pagination *helper.Pagination) ([]constant.YearWithSubjectEntity, error) {
	query := `
		SELECT
			"y"."id",
			"y"."curriculum_group_id",
			"y"."platform_id",
			"y"."seed_year_id",
			"y"."status",
			"y"."created_at",
			"y"."created_by",
			"y"."updated_at",
			"u"."first_name" AS "updated_by",
			"y"."admin_login_as",
			"sy"."name" AS "seed_year_name",
			"sy"."short_name" AS "seed_year_short_name"
		FROM "curriculum_group"."year" y
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "user"."user" u
			ON "y"."updated_by" = "u"."id"
		WHERE
			"y"."platform_id" = $1
	`
	args := []interface{}{platformId}
	argsIndex := 2

	if filter != nil && filter.SearchText != "" {
		query += fmt.Sprintf(` AND "sy"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter != nil && filter.Status != "" {
		query += fmt.Sprintf(` AND "y"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}

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
		query += fmt.Sprintf(` ORDER BY "y"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	yearWithSubjectEntities := []constant.YearWithSubjectEntity{}
	err := postgresRepository.Database.Select(&yearWithSubjectEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	subjectQuery := `
		SELECT
			"s".*
		FROM "subject"."subject" s
		LEFT JOIN "curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		WHERE y.id = $1
	`
	for i, yearWithSubjectEntity := range yearWithSubjectEntities {
		yearWithSubjectEntity.Subjects = []constant.SubjectEntity{}
		err := postgresRepository.Database.Select(&yearWithSubjectEntity.Subjects, subjectQuery, yearWithSubjectEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		yearWithSubjectEntities[i] = yearWithSubjectEntity
	}

	return yearWithSubjectEntities, nil
}
