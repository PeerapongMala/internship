package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLearningContent(curriculumGroupId int, filter constant.LearningContentFilter, pagination *helper.Pagination) ([]constant.LearningContentResponse, int, error) {
	query := `SELECT
		"lc"."id",
		"lc"."name",
		"la"."id" AS "learning_area_id",
		"la"."name" AS "learning_area_name",
		"ct"."id" AS "content_id",
		"ct"."name" AS "content_name",
		"ctr"."id" AS "criteria_id",
		"ctr"."short_name" AS "criteria_short_name",
		"ctr"."name" AS "criteria_name",
		"y"."id" AS "year_id",
		"sy"."short_name" AS "seed_year_name",
		"lc"."status",
		"lc"."created_at",	
		"lc"."created_by",
		"lc"."updated_at",	
		"u"."first_name" AS "updated_by",
		"lc"."admin_login_as"
	FROM 
		"curriculum_group"."learning_content" lc
	LEFT JOIN "curriculum_group"."criteria" ctr
		ON "lc"."criteria_id" = "ctr"."id"
	LEFT JOIN "curriculum_group"."content" ct
		ON "ctr"."content_id" = "ct"."id"
	LEFT JOIN "curriculum_group"."learning_area" la
		ON "ct"."learning_area_id" = "la"."id"
	LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "la"."curriculum_group_id" = "cg"."id"
	LEFT JOIN "user"."user" u 
		ON "lc"."updated_by" = "u"."id"
	LEFT JOIN "curriculum_group"."year" y
		ON "la"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
		ON "y"."seed_year_id" = "sy"."id"
	WHERE "cg"."id" = $1

	
	`

	args := []interface{}{curriculumGroupId}
	argsI := 2

	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "lc"."id" = $%d`, argsI)
		args = append(args, filter.Id)
		argsI++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "y"."id" = $%d`, argsI)
		args = append(args, filter.YearId)
		argsI++
	}
	if filter.ContentId != 0 {
		query += fmt.Sprintf(` AND "ct"."id" = $%d`, argsI)
		args = append(args, filter.ContentId)
		argsI++
	}
	if filter.CriteriaId != 0 {
		query += fmt.Sprintf(` AND "ctr"."id" = $%d`, argsI)
		args = append(args, filter.CriteriaId)
		argsI++
	}
	if filter.LearningAreaId != 0 {
		query += fmt.Sprintf(` AND "la"."id" = $%d`, argsI)
		args = append(args, filter.LearningAreaId)
		argsI++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "lc"."status" = $%d`, argsI)
		args = append(args, filter.Status)
		argsI++

	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "lc"."name" ILIKE $%d`, argsI)
		args = append(args, "%"+filter.SearchText+"%")
		argsI++
	}
	query += fmt.Sprintf(` ORDER BY "lc"."id" LIMIT $%d OFFSET $%d`, argsI, argsI+1)
	args = append(args, pagination.Limit, pagination.Offset)

	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	countQuery := `SELECT COUNT(*) FROM
	"curriculum_group"."learning_content" lc
	LEFT JOIN "curriculum_group"."criteria" ctr
		ON "lc"."criteria_id" = "ctr"."id"
	LEFT JOIN "curriculum_group"."content" ct
		ON "ctr"."content_id" = "ct"."id"
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
		countQuery += fmt.Sprintf(` AND "lc"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.Id)
		countArgsI++
	}

	if filter.YearId != 0 {
		countQuery += fmt.Sprintf(` AND "y"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.YearId)
		countArgsI++
	}

	if filter.ContentId != 0 {
		countQuery += fmt.Sprintf(` AND "ct"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.ContentId)
		countArgsI++
	}

	if filter.CriteriaId != 0 {
		countQuery += fmt.Sprintf(` AND "ctr"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.CriteriaId)
		countArgsI++
	}

	if filter.LearningAreaId != 0 {
		countQuery += fmt.Sprintf(` AND "la"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.LearningAreaId)
		countArgsI++
	}
	if filter.Status != "" {
		countQuery += fmt.Sprintf(` AND "lc"."status" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.Status)
		countArgsI++
	}
	if filter.SearchText != "" {
		countQuery += fmt.Sprintf(` AND "lc"."name" ILIKE $%d`, countArgsI)
		countArgs = append(countArgs, "%"+filter.SearchText+"%")
		countArgsI++
	}

	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	responses := []constant.LearningContentResponse{}
	for rows.Next() {
		response := constant.LearningContentResponse{}
		err := rows.Scan(
			&response.Id,
			&response.Name,
			&response.LearningAreaId,
			&response.LearningAreaName,
			&response.ContentId,
			&response.ContentName,
			&response.CriteriaId,
			&response.CriteriaShortName,
			&response.CriteriaName,
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
