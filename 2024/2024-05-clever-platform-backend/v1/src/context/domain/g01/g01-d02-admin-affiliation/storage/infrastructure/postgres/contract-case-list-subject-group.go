package postgres

import (
	"fmt"
	"log"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractCaseListSubjectGroup(contractId int, filter *constant2.ContractSubjectGroupFilter, pagination *helper.Pagination) ([]constant2.ContractSubjectGroupDataEntity, error) {
	query := `
		SELECT
			sg.id,
			cg."name" AS "curriculum_group",
			ssg."name" AS "subject_group",
			sy.short_name AS "year",
			"sp"."name" AS "platform_name",
			sg.updated_at,
			u.first_name AS "updated_by",
			csg.is_enabled
		FROM 
			school_affiliation.contract_subject_group csg
		LEFT JOIN 
			"curriculum_group"."subject_group" sg 
			ON "csg"."subject_group_id" = "sg"."id"
		LEFT JOIN 
			curriculum_group."year" y 
			ON sg.year_id = y.id
		LEFT JOIN
			"curriculum_group"."platform" p
			ON "y"."platform_id" = "p"."id"
		LEFT JOIN
			"platform"."seed_platform" sp
			ON "p"."seed_platform_id" = "sp"."id"
		LEFT JOIN 
			curriculum_group.curriculum_group cg 
			ON p.curriculum_group_id = cg.id
		LEFT JOIN 
			"user"."user" u 
			ON sg.updated_by = u.id
		LEFT JOIN 
			"curriculum_group"."seed_subject_group" ssg 
			ON sg.seed_subject_group_id = ssg.id
		LEFT JOIN 
			"curriculum_group"."seed_year" sy 
			ON y.seed_year_id = sy.id
		WHERE 
			csg.contract_id = $1
	`
	args := []interface{}{contractId}
	argsIndex := 2

	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "ssg"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.SeedYearId != 0 {
		query += fmt.Sprintf(` AND "sy"."id" = $%d`, argsIndex)
		args = append(args, filter.SeedYearId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		log.Println(countQuery)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "sg"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	contractSubjectDataEntities := []constant2.ContractSubjectGroupDataEntity{}
	err := postgresRepository.Database.Select(&contractSubjectDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
	SELECT
		"s"."name"
	FROM "subject"."subject" s
	LEFT JOIN "curriculum_group"."subject_group" sg	
		ON "sg"."id" = "s"."subject_group_id"
	WHERE
		"sg"."id" = $1
	`
	for i, contractSubjectDataEntity := range contractSubjectDataEntities {
		subjects := []string{}
		err := postgresRepository.Database.Select(&subjects, query, contractSubjectDataEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		contractSubjectDataEntities[i].Subjects = subjects
	}

	return contractSubjectDataEntities, nil
}
