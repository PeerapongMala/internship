package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectGroupList(pagination *helper.Pagination, seedYearId, platformId int) ([]constant.SubjectGroupEntity, error) {
	baseQuery := `
		SELECT 
			"sg"."id",
			"cg"."short_name" AS "curriculum_group",
			"sy"."short_name" AS "year",
			"ssg"."name"
		FROM "curriculum_group"."subject_group" sg
		LEFT JOIN "curriculum_group"."seed_subject_group" ssg
			ON "sg"."seed_subject_group_id" = "ssg"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "curriculum_group"."platform" p
		    ON "y"."platform_id" = "p"."id"
		LEFT JOIN "curriculum_group"."curriculum_group" cg
			ON "p"."curriculum_group_id" = "cg"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if platformId != 0 {
		baseQuery += fmt.Sprintf(` AND "p"."seed_platform_id" = $%d`, argsIndex)
		argsIndex++
		args = append(args, platformId)
	}
	if seedYearId != 0 {
		baseQuery += fmt.Sprintf(` AND "sy"."id" = $%d`, argsIndex)
		argsIndex++
		args = append(args, seedYearId)
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, baseQuery)
		log.Println(countQuery)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		baseQuery += fmt.Sprintf(` ORDER BY "sg"."id" LIMIT $%d OFFSET $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Limit, pagination.Offset)
		argsIndex = argsIndex + 2
	}

	subjectGroupEntities := []constant.SubjectGroupEntity{}
	err := postgresRepository.Database.Select(&subjectGroupEntities, baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	baseQuery = `
		SELECT
			"s"."name"
		FROM "subject"."subject" s
		LEFT JOIN "curriculum_group"."subject_group" sg	
			ON "sg"."id" = "s"."subject_group_id"
		WHERE
			"sg"."id" = $1
	`

	for i, subjectGroup := range subjectGroupEntities {
		log.Println(subjectGroup.Id)
		subjects := []string{}
		err := postgresRepository.Database.Select(&subjects, baseQuery, subjectGroup.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		subjectGroupEntities[i].Subjects = subjects
	}

	return subjectGroupEntities, nil
}
