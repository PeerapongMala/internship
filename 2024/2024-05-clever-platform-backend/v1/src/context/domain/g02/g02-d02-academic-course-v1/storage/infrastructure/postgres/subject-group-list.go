package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectGroupList(yearId int, filter *constant.SubjectGroupFilter, pagination *helper.Pagination) ([]constant.SubjectGroupWithSubjectEntity, error) {
	query := `
		SELECT
			"sg"."id",
			"sg"."year_id",
			"sg"."status",
			"sg"."created_at",
			"sg"."created_by",
			"sg"."updated_at",
			"u"."first_name" AS "updated_by",
			"sg"."admin_login_as",
			"sg"."seed_subject_group_id",
			"ssg".name,
			"sg"."full_option",
			"sg"."theme",
			"sg"."url"
		FROM "curriculum_group"."subject_group" sg
		LEFT JOIN "curriculum_group"."seed_subject_group" ssg
			ON "sg"."seed_subject_group_id" = "ssg"."id"
		LEFT JOIN "user"."user" u
			ON "sg"."updated_by" = "u"."id"
		WHERE 
			"year_id" = $1
	`
	args := []interface{}{yearId}
	argsIndex := 2

	if filter != nil && filter.SearchText != "" {
		query += fmt.Sprintf(` AND "ssg"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter != nil && filter.Status != "" {
		query += fmt.Sprintf(` AND "sg"."status" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Status+"%")
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
	}

	query += fmt.Sprintf(` ORDER BY "sg"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	args = append(args, pagination.Offset, pagination.Limit)

	subjectGroupDataEntities := []constant.SubjectGroupDataEntity{}
	err := postgresRepository.Database.Select(&subjectGroupDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	subjectQuery := `
		SELECT
			*
		FROM "subject"."subject" s
		WHERE
			"subject_group_id" = $1
	`

	subjectGroupWithSubjectEntities := []constant.SubjectGroupWithSubjectEntity{}
	for _, subjectGroupDataEntity := range subjectGroupDataEntities {
		subjectGroupWithSubjectEntity := constant.SubjectGroupWithSubjectEntity{}
		subjectEntities := []constant.SubjectEntity{}
		err := postgresRepository.Database.Select(
			&subjectEntities,
			subjectQuery,
			subjectGroupDataEntity.Id,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		subjectGroupWithSubjectEntity.SubjectGroupDataEntity = subjectGroupDataEntity
		subjectGroupWithSubjectEntity.Subjects = subjectEntities
		subjectGroupWithSubjectEntities = append(subjectGroupWithSubjectEntities, subjectGroupWithSubjectEntity)
	}

	return subjectGroupWithSubjectEntities, nil
}
