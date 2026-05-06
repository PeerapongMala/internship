package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectList(filter *constant.SubjectFilter, pagination *helper.Pagination) ([]constant.SubjectDataEntity, error) {
	query := `
		SELECT
			"s"."id",
			"s"."subject_group_id",
			"sy"."id" AS "seed_year_id",
			"sy"."short_name" AS "seed_year_short_name",
			"s"."name",
			"s"."project",
			"s"."subject_language_type",
			"s"."subject_language",
			"s"."image_url",
			"s"."status",
			"s"."created_at",
			"s"."created_by",
			"s"."updated_at",
			"u"."first_name" AS "updated_by",
			"s"."admin_login_as",
			"ssg"."name" AS "seed_subject_group_name",
			"ssg"."id" AS "seed_subject_group_id"	
		FROM "subject"."subject" s 
		LEFT JOIN "user"."user" u
			ON "s"."updated_by" = "u"."id"
		LEFT JOIN "curriculum_group"."subject_group" sg
		    ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
		    ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."platform" p
		    ON "y"."platform_id" = "p"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
		    ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "curriculum_group"."seed_subject_group" ssg
			ON "sg"."seed_subject_group_id" = "ssg"."id"
		WHERE
		    TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "y"."curriculum_group_id" = $1`)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.PlatformId != 0 {
		query += fmt.Sprintf(` AND "p"."id" = $%d`, argsIndex)
		args = append(args, filter.PlatformId)
		argsIndex++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "y"."id" = $%d`, argsIndex)
		args = append(args, filter.YearId)
		argsIndex++
	}
	if filter.SubjectGroupId != 0 {
		query += fmt.Sprintf(` AND "sg"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectGroupId)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "s"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "s"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
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
		query += fmt.Sprintf(` ORDER BY "s"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subjectDataEntities := []constant.SubjectDataEntity{}
	err := postgresRepository.Database.Select(&subjectDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectDataEntities, nil
}
