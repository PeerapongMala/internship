package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CurriculumGroupCaseListByContentCreator(pagination *helper.Pagination, filter *constant.CurriculumGroupFilter) ([]constant.CurriculumGroupEntity, error) {
	query := `
		SELECT DISTINCT ON ("cg"."id")
			"cg"."id",
			"cg"."name",
			"cg"."short_name",
			"cg"."status",
			"cg"."created_at",
			"cg"."created_by",
			"cg"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM "curriculum_group"."curriculum_group" cg
		LEFT JOIN "curriculum_group"."curriculum_group_content_creator" cgcc
			ON "cg"."id" = "cgcc"."curriculum_group_id"
		LEFT JOIN "user"."user" u
			ON "cg"."updated_by" = "u"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "cg"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter.ContentCreatorId != "" {
		query += fmt.Sprintf(` AND "cgcc"."content_creator_id" = $%d`, argsIndex)
		args = append(args, filter.ContentCreatorId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		log.Println(args...)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	args = append(args, pagination.Offset, pagination.Limit)

	curriculumGroupEntities := []constant.CurriculumGroupEntity{}
	err := postgresRepository.Database.Select(&curriculumGroupEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return curriculumGroupEntities, nil
}
