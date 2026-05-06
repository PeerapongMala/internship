package postgres

import (
	"fmt"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) SubjectList(SchoolId int, filter constant.FilterSubject, pagination *helper.Pagination) ([]constant.SubjectResponse, int, error) {
	query := `
	SELECT DISTINCT ON ("s"."id")
	"s"."id",
	"sp"."name" AS "platform_name",
	"s"."name",
	"sg"."id" AS"subject_group_id",
	"ssg"."name" AS "subject_group_name",
	"y"."id" AS "year_id",
	"sy"."short_name" AS "seed_year_name",
	"cg"."id" AS "curriculum_group_id",
	"cg"."name" AS "curriculum_group_name",
	CASE WHEN "ss"."is_enabled" THEN 'enabled' ELSE 'disabled' END AS "status",
	"s"."created_at",
	"s"."created_by",
	"s"."updated_at",
	"u"."first_name" AS "updated_by"
	FROM "school"."school_subject" ss
	LEFT JOIN "subject"."subject" s
	ON "ss"."subject_id" = "s"."id"
	LEFT JOIN "curriculum_group"."subject_group" sg
	ON "s"."subject_group_id" = "sg"."id"
	LEFT JOIN "curriculum_group"."seed_subject_group" ssg
	ON "sg"."seed_subject_group_id" = "ssg"."id"
	LEFT JOIN "curriculum_group"."year" y
	ON "sg"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."platform" cp
	ON "y"."platform_id" = "cp"."id"
	LEFT JOIN "platform"."seed_platform" sp
	ON "cp"."seed_platform_id" = "sp"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
	ON "y"."seed_year_id" = "sy"."id"
	LEFT JOIN "curriculum_group"."curriculum_group" cg
	ON "y"."curriculum_group_id" = "cg"."id"
	LEFT JOIN "user"."user" u 
	ON "s"."updated_by" = "u"."id"
	WHERE "ss"."school_id" = $1
	
	`
	args := []interface{}{SchoolId}
	argsI := 2
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d `, argsI)
		args = append(args, filter.CurriculumGroupId)
		argsI++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "y"."id" = $%d `, argsI)
		args = append(args, filter.YearId)
		argsI++
	}
	if filter.SeedYearName != "" {
		query += fmt.Sprintf(` AND "sy"."short_name" = $%d `, argsI)
		args = append(args, filter.SeedYearName)
		argsI++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "s"."status" = $%d `, argsI)
		args = append(args, filter.Status)
		argsI++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(` AND "sy"."short_name" = $%d`, argsI)
		args = append(args, filter.Year)
		argsI++
	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND ( "s"."id"::TEXT = $%d
									OR "cg"."name" ILIKE $%d
									OR "sp"."name" ILIKE $%d
									OR "ssg"."name" ILIKE $%d
									OR "sy"."short_name" ILIKE $%d
									OR "s"."name" ILIKE $%d)`, argsI, argsI, argsI, argsI, argsI, argsI)
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
	query += fmt.Sprintf(` ORDER BY "s"."id" LIMIT $%d OFFSET $%d`, argsI, argsI+1)
	args = append(args, pagination.Limit, pagination.Offset)

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.SubjectResponse{}
	for rows.Next() {
		response := constant.SubjectResponse{}
		rows.StructScan(&response)

		responses = append(responses, response)
	}

	return responses, totalCount, nil
}
