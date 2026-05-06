package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLearningArea(curriculumGroupId int, filter constant.LearningAreaFilter, pagination *helper.Pagination) ([]constant.LearningAreaResponse, int, error) {
	query := `SELECT
		"la"."id",
		"cg"."id" AS "curriculum_group_id",
		"cg"."name" AS "curriculum_group_name",
		"cg"."short_name" AS "curriculum_group_short_name",
		"la"."year_id" AS "year_id",
		"sy"."short_name" AS "seed_year_name",
		"la"."name",
		"la"."status",
		"la"."created_at",
		"la"."created_by",
		"la"."updated_at",
		"u"."first_name" AS "updated_by",
		"la"."admin_login_as",
		"y"."id"
	FROM
		"curriculum_group"."learning_area" la
	LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "la"."curriculum_group_id" = "cg"."id"
	LEFT JOIN "curriculum_group"."year" y
		ON "la"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
		ON "y"."seed_year_id" = "sy"."id"
	LEFT JOIN "user"."user" u 
		ON "la"."updated_by" = "u"."id"
	WHERE "cg"."id" = $1`
	args := []interface{}{curriculumGroupId}
	argsI := 2
	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "la"."id" = $%d`, argsI)
		args = append(args, filter.Id)
		argsI++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "y"."id" = $%d`, argsI)
		args = append(args, filter.YearId)
		argsI++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "la"."status" = $%d`, argsI)
		args = append(args, filter.Status)
		argsI++

	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "la"."name" ILIKE $%d`, argsI)
		args = append(args, "%"+filter.SearchText+"%")
		argsI++
	}

	query += fmt.Sprintf(` ORDER BY "la"."id" LIMIT $%d OFFSET $%d`, argsI, argsI+1)
	args = append(args, pagination.Limit, pagination.Offset)

	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}

	countQuery := `SELECT COUNT(*) FROM "curriculum_group"."learning_area" la
	LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "la"."curriculum_group_id" = "cg"."id"
	LEFT JOIN "curriculum_group"."year" y
		ON "la"."year_id" = "y"."id"
	WHERE "cg"."id" = $1`
	countArgs := []interface{}{curriculumGroupId}
	countArgsI := 2

	if filter.Id != 0 {
		countQuery += fmt.Sprintf(` AND "la"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.Id)
		countArgsI++
	}
	if filter.YearId != 0 {
		countQuery += fmt.Sprintf(` AND "y"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.YearId)
		countArgsI++
	}
	if filter.Status != "" {
		countQuery += fmt.Sprintf(` AND "la"."status" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.Status)
		countArgsI++
	}
	if filter.SearchText != "" {
		countQuery += fmt.Sprintf(` AND "la"."name" ILIKE $%d`, countArgsI)
		countArgs = append(countArgs, "%"+filter.SearchText+"%")
		countArgsI++
	}

	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}

	responses := []constant.LearningAreaResponse{}
	for rows.Next() {
		response := constant.LearningAreaResponse{}
		err := rows.Scan(
			&response.Id,
			&response.CurriculumGroupId,
			&response.CurriculumGroupName,
			&response.CurriculumGroupShortName,
			&response.YearId,
			&response.SeedYearName,
			&response.Name,
			&response.Status,
			&response.CreatedAt,
			&response.CreatedBy,
			&response.UpdatedAt,
			&response.UpdatedBy,
			&response.AdminLoginAs,
			&response.YearId,
		)
		if err != nil {
			return nil, 0, err
		}
		responses = append(responses, response)
	}

	return responses, totalCount, nil
}
