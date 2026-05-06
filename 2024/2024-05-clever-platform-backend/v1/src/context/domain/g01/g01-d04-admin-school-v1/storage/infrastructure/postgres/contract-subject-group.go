package postgres

import (
	"fmt"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) ContractSubjectGroup(pagination *helper.Pagination, contractId int, filter constant.FilterSubject) ([]constant.ContractsSubjectGroup, int, error) {
	query := `
 SELECT
	"ct"."id" AS "contract_id",
	"ct"."name" AS "contract_name",
	"sj"."id" AS "subject_id",
	"sj"."name" AS "subject_name",
	"sg"."id" AS "subject_group_id",
	"ssg"."name" AS "subject_group_name",
	"cg"."id" AS "curriculum_group_id",
	"cg"."name" AS "curriculum_group_name",
	"y"."id" AS "year_id",
	"sy"."short_name" AS "seed_year_short_name",
	"sg"."status",
	"sg"."created_at",
	"sg"."created_by",
	"sg"."updated_at",
	"u"."first_name" AS "updated_by"
	FROM "school_affiliation"."contract_subject_group" csg
	LEFT JOIN "school_affiliation"."contract" ct
	ON "csg"."contract_id" = "ct"."id"
	LEFT JOIN "curriculum_group"."subject_group" sg
	ON "csg"."subject_group_id" = "sg"."id"
	LEFT JOIN "curriculum_group"."seed_subject_group" ssg
	ON "sg"."seed_subject_group_id" = "ssg"."id"
	LEFT JOIN "subject"."subject" sj
	ON "sj"."subject_group_id" = "sg"."id"
	LEFT JOIN "curriculum_group"."year" y
	ON "sg"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
	ON "y"."seed_year_id" = "sy"."id"
	LEFT JOIN "curriculum_group"."curriculum_group" cg
	ON "y"."curriculum_group_id" = "cg"."id"
	LEFT JOIN "user"."user" u
	ON "sg"."updated_by" = "u"."id"
	WHERE "csg"."contract_id" = $1
 `
	args := []interface{}{contractId}
	argsI := 2
	if filter.Status != "" {
		query += fmt.Sprintf(`  AND "sg"."status" = $%d`, argsI)
		args = append(args, filter.Status)
		argsI++
	}
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(`  AND "cg"."id" =  $%d`, argsI)
		args = append(args, filter.CurriculumGroupId)
		argsI++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(`  AND "y"."id" = $%d`, argsI)
		args = append(args, filter.YearId)
		argsI++
	}
	if filter.SeedYearName != "" {
		query += fmt.Sprintf(`  AND "sy"."short_name" = $%d`, argsI)
		args = append(args, filter.SeedYearName)
		argsI++
	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND ( "sj"."id"::TEXT = $%d
									OR "cg"."name" ILIKE $%d
									OR "sj"."name" ILIKE $%d
									OR "sy"."short_name" ILIKE $%d)`, argsI, argsI, argsI, argsI)
		searchText := filter.SearchText
		id := 0
		id, _ = strconv.Atoi(filter.SearchText)
		if id != 0 {
			searchText = filter.SearchText
		} else {

			searchText = fmt.Sprintf("%%%s%%", filter.SearchText)
		}

		args = append(args, searchText)
		argsI++

	}
	var totalCount int
	countQuery := fmt.Sprintf(`SELECT COUNT (*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRow(countQuery, args...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	query += fmt.Sprintf(` ORDER BY "sj"."id" LIMIT $%d OFFSET $%d`, argsI, argsI+1)
	args = append(args, pagination.Limit, pagination.Offset)
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return nil, 0, err
	}

	responses := []constant.ContractsSubjectGroup{}
	for rows.Next() {
		response := constant.ContractsSubjectGroup{}
		err := rows.StructScan(&response)
		if err != nil {
			return nil, 0, err
		}
		responses = append(responses, response)
	}

	return responses, totalCount, nil
}
