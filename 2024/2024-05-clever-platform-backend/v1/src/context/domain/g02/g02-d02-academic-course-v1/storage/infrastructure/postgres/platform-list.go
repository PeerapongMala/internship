package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) PlatformList(filter *constant.PlatformFilter, pagination *helper.Pagination) ([]constant.PlatformWithSubjectsEntity, error) {
	query := `
		SELECT
			"p"."id",
			"p"."curriculum_group_id",
			"p"."seed_platform_id",
			"sp"."name" AS "seed_platform_name",
			"p"."status",
			"p"."created_at",
			"p"."created_by",
			"p"."updated_at",
			"u"."first_name" AS "updated_by",
			"p"."admin_login_as"
		FROM
			"curriculum_group"."platform" p
		LEFT JOIN
			"platform"."seed_platform" sp
			ON "p"."seed_platform_id" = "sp"."id"
		LEFT JOIN
			"user"."user" u
			ON "p"."updated_by" = "u"."id"
		WHERE
		    "p"."curriculum_group_id" = $1
`
	args := []interface{}{filter.CurriculumGroupId}
	argsIndex := 2

	if filter.PlatformId != 0 {
		query += fmt.Sprintf(` AND "p"."id" = $%d`, argsIndex)
		args = append(args, filter.PlatformId)
		argsIndex++
	}
	if filter.PlatformName != "" {
		query += fmt.Sprintf(` AND "sp"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.PlatformName+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "p"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "p"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	platformWithSubjectEntities := []constant.PlatformWithSubjectsEntity{}
	err := postgresRepository.Database.Select(&platformWithSubjectEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	subjectQuery := `
		SELECT
			"s".*
		FROM
			"subject"."subject" s
		LEFT JOIN "curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."platform" p
			ON "y"."platform_id" = "p"."id"
		WHERE "p"."id" = $1
`
	for i, platformWithSubjectEntity := range platformWithSubjectEntities {
		platformWithSubjectEntity.Subjects = []constant.SubjectEntity{}
		err := postgresRepository.Database.Select(&platformWithSubjectEntity.Subjects, subjectQuery, platformWithSubjectEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		platformWithSubjectEntities[i] = platformWithSubjectEntity
	}

	return platformWithSubjectEntities, nil
}
