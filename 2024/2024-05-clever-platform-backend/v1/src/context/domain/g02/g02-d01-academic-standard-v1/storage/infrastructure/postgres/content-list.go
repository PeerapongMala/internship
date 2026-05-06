package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetContent(curriculumGroupId int, filter constant.ContentFilter, pagination *helper.Pagination) ([]constant.ContentResponse, int, error) {
	query := `SELECT
			"ct"."id",
			"ct"."name" ,
			"cg"."id" AS "curriculum_group_id",
			"cg"."name" AS "curriculum_group_name",
			"la"."id",
			"la"."name" AS "learning_area_name",
			"y"."id" AS "year_id",
			"sy"."short_name" AS "seed_year_name",
			"ct"."status",
			"ct"."created_at",
			"ct"."created_by",
			"ct"."updated_at",
			"u"."first_name" AS "updated_by",
			"ct"."admin_login_as"
			
	FROM
   		 "curriculum_group"."content" ct
	LEFT JOIN "curriculum_group"."learning_area" la
   		 ON "ct"."learning_area_id" = "la"."id"
	LEFT JOIN "curriculum_group"."curriculum_group"cg
		 ON "la"."curriculum_group_id" = "cg"."id"
	LEFT JOIN "curriculum_group"."year" y
		 ON "la"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
		 ON "y"."seed_year_id" = "sy"."id"
	LEFT JOIN "user"."user" u
		ON "ct"."updated_by" = "u"."id"
	WHERE "cg"."id" = $1
	`
	args := []interface{}{curriculumGroupId}
	argsI := 2
	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "ct"."id" = $%d`, argsI)
		args = append(args, filter.Id)
		argsI++
	}
	if filter.LearningAreaId != 0 {
		query += fmt.Sprintf(` AND "la"."id" = $%d`, argsI)
		args = append(args, filter.LearningAreaId)
		argsI++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "ct"."status" = $%d`, argsI)
		args = append(args, filter.Status)
		argsI++

	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "ct"."name" ILIKE $%d`, argsI)
		args = append(args, "%"+filter.SearchText+"%")
		argsI++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "y"."id" = $%d`, argsI)
		args = append(args, filter.YearId)
		argsI++
	}

	query += fmt.Sprintf(` ORDER BY "ct"."id" LIMIT $%d OFFSET $%d`, argsI, argsI+1)
	args = append(args, pagination.Limit, pagination.Offset)

	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}

	countQuery := `SELECT COUNT(*)
	FROM "curriculum_group"."content" ct
	LEFT JOIN "curriculum_group"."learning_area" la
		ON "ct"."learning_area_id" = "la"."id"
	LEFT JOIN "curriculum_group"."year" y
		ON "la"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "la"."curriculum_group_id" = "cg"."id"
	WHERE "cg"."id" = $1`
	countArgs := []interface{}{curriculumGroupId}
	countArgsI := 2
	if filter.Id != 0 {
		countQuery += fmt.Sprintf(` AND "ct"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.Id)
		countArgsI++
	}
	if filter.LearningAreaId != 0 {
		countQuery += fmt.Sprintf(` AND "la"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.LearningAreaId)
		countArgsI++
	}
	if filter.Status != "" {
		countQuery += fmt.Sprintf(` AND "ct"."status" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.Status)
		countArgsI++
	}
	if filter.SearchText != "" {
		countQuery += fmt.Sprintf(` AND "ct"."name" ILIKE $%d`, countArgsI)
		countArgs = append(countArgs, "%"+filter.SearchText+"%")
		countArgsI++
	}
	if filter.YearId != 0 {
		countQuery += fmt.Sprintf(` AND "y"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.YearId)
		countArgsI++
	}
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}

	responses := []constant.ContentResponse{}

	for rows.Next() {
		response := constant.ContentResponse{}
		err := rows.Scan(
			&response.Id,
			&response.Name,
			&response.CurriculumGroupId,
			&response.CurriculumGroupName,
			&response.LearningAreaId,
			&response.LearningAreaName,
			&response.YearId,
			&response.SeedYearName,
			&response.Status,
			&response.CreatedAt,
			&response.CreatedBy,
			&response.UpdatedAt,
			&response.UpdatedBy,
			&response.AdminLoginAs,
		)
		if err != nil {

			return nil, 0, err
		}
		responses = append(responses, response)
	}
	return responses, totalCount, nil
}
